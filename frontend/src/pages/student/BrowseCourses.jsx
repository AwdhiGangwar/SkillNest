import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCourses, enrollInCourse, createEnrollmentRequest } from '../../services/api';
import toast from 'react-hot-toast';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestCourse, setRequestCourse] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses(); // ✅ use api.js
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, title) => {
    if (!window.confirm(`Enroll in "${title}" ?`)) return;

    setEnrollingId(courseId);

    try {
      await enrollInCourse(courseId); // ✅ gateway + token handled
      toast.success('✅ Enrollment Successful!');
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleOpenDetailModal = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleOpenDetailModal(course)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 flex flex-col"
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="mb-2">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                  {course.level || 'Beginner'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">{course.title}</h3>
              
              {course.teacherName && (
                <p className="text-sm text-purple-600 text-black font-medium mb-2">
                  👨‍🏫 {course.teacherName}
                </p>
              )}

              <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                {course.description}
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4 py-3 border-y">
                {course.totalClasses && (
                  <div className="text-center">
                    <span className="block font-semibold text-gray-900">{course.totalClasses}</span>
                    <span className="text-xs">Classes</span>
                  </div>
                )}
                {course.duration && (
                  <div className="text-center">
                    <span className="block font-semibold text-gray-900">{course.duration}h</span>
                    <span className="text-xs">Duration</span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block font-semibold text-green-600">₹{course.price}</span>
                  <span className="text-xs">Price</span>
                </div>
              </div>

              <div className="flex gap-2">
               
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRequestCourse(course);
                    setShowRequestModal(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl font-medium transition text-sm"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No courses available at the moment.
        </p>
      )}

      {/* Request Enrollment Modal */}
      {showRequestModal && requestCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRequestModal(false)} />
          <div className="bg-white rounded-xl p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Request Enrollment: {requestCourse.title}</h3>
            <p className="text-sm text-gray-600 mb-4">You can add an optional message for the admin.</p>
            <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} className="w-full input-field mb-4" rows={4} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRequestModal(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await createEnrollmentRequest({ courseId: requestCourse.id, message: requestMessage });
                    toast.success('Request submitted');
                    setShowRequestModal(false);
                    setRequestMessage("");
                  } catch (err) {
                    toast.error(err.message || 'Failed to submit request');
                  }
                }}
                className="btn-primary"
              >Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="bg-white rounded-2xl z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCourse.imageUrl && (
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded">
                      {selectedCourse.level || 'Beginner'} • {selectedCourse.category || 'General'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                  {selectedCourse.teacherName && (
                    <p className="text-lg text-purple-600 font-semibold">
                      👨‍🏫 Instructor: {selectedCourse.teacherName}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

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
                    <p className="text-gray-600 text-sm mb-1">Total Classes</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedCourse.totalClasses}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-sm mb-1">Max Students</p>
                  <p className="text-2xl font-bold text-amber-600">{selectedCourse.maxStudents || 'Unlimited'}</p>
                </div>
              </div>

              {selectedCourse.modules && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Course Modules</h3>
                  <div className="space-y-2">
                    {(typeof selectedCourse.modules === 'string' ? selectedCourse.modules.split(',') : selectedCourse.modules)
                      .map((module, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-blue-600 font-bold">{idx + 1}.</span>
                          <span className="text-gray-700">{module.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEnroll(selectedCourse.id, selectedCourse.title);
                  }}
                  disabled={enrollingId === selectedCourse.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  {enrollingId === selectedCourse.id ? "Enrolling..." : "Enroll Now"}
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setRequestCourse(selectedCourse);
                    setShowRequestModal(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Request Enrollment
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
