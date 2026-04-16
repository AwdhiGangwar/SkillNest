import { useState, useEffect } from 'react';
import { getMyCourses, createSupportTicket } from '../../services/api'; // ✅ use api.js
import { Modal } from '../../components/ui';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Enrolled Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
            <p className="text-gray-600 flex-1">{course.description}</p>

            <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
              <span className="text-green-600 font-medium">₹{course.price}</span>
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full">
                Enrolled
              </span>
              <button className="btn-ghost" onClick={() => setShowTicketModal(true)}>Raise Ticket</button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">You haven't enrolled in any course yet.</p>
          <a href="/student/courses" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse Courses →
          </a>
        </div>
      )}
      <Modal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} title="Raise Support Ticket">
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