import { useState, useEffect } from 'react';
import { getMyCourses, createSupportTicket } from '../../services/api'; // ✅ use api.js
import { Modal } from '../../components/ui';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await getMyCourses(); // 🔥 token auto attach
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading your courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-white-800">My Enrolled Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">You haven't enrolled in any course yet.</p>
          <a href="/student/courses" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse Courses →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Enrolled
                  </span>
                </div>

                {course.teacherName && (
                  <p className="text-sm text-purple-600 font-medium mb-3">
                    👨‍🏫 {course.teacherName}
                  </p>
                )}

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                  {course.totalClasses && (
                    <div className="text-center">
                      <span className="block font-bold text-gray-900">{course.totalClasses}</span>
                      <span className="text-gray-600">Classes</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="text-center">
                      <span className="block font-bold text-gray-900">{course.duration}h</span>
                      <span className="text-gray-600">Duration</span>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="block font-bold text-green-600">₹{course.price}</span>
                    <span className="text-gray-600">Price</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-blue-600">{course.level || '—'}</span>
                    <span className="text-gray-600">Level</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCourseDetail(true);
                    }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowTicketModal(true);
                    }}
                    className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Raise Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {showCourseDetail && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCourseDetail(false)} />
          <div className="bg-white rounded-2xl z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCourse.imageUrl && (
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="w-full h-56 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded mb-3">
                    ✓ Enrolled
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedCourse.title}</h2>
                </div>
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {selectedCourse.teacherName && (
                <p className="text-lg text-purple-600 font-semibold mb-4">
                  👨‍🏫 Instructor: {selectedCourse.teacherName}
                </p>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedCourse.price}</p>
                </div>
                {selectedCourse.duration && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Duration</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCourse.duration}h</p>
                  </div>
                )}
                {selectedCourse.totalClasses && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Classes</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedCourse.totalClasses}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-sm mb-1">Level</p>
                  <p className="text-2xl font-bold text-amber-600">{selectedCourse.level || 'Beginner'}</p>
                </div>
              </div>

              {selectedCourse.modules && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Course Modules</h3>
                  <div className="space-y-2">
                    {(typeof selectedCourse.modules === 'string' ? selectedCourse.modules.split(',') : selectedCourse.modules)
                      .map((module, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600 font-bold mt-0.5">✓</span>
                          <span className="text-gray-700">{module.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCourseDetail(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      <Modal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} title={`Raise Support Ticket - ${selectedCourse?.title}`}>
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!ticketForm.subject || !ticketForm.message) return toast.error("Fill subject and message");
          try {
            await createSupportTicket(ticketForm);
            toast.success("Ticket submitted");
            setTicketForm({ subject: "", message: "" });
            setShowTicketModal(false);
          } catch (err) {
            toast.error("Failed to submit ticket");
          }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <input value={ticketForm.subject} onChange={(e) => setTicketForm(s => ({...s, subject: e.target.value}))} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea value={ticketForm.message} onChange={(e) => setTicketForm(s => ({...s, message: e.target.value}))} rows={5} className="input-field w-full resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowTicketModal(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Submit Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyCoursesPage;