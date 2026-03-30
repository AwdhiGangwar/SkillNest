import { useState, useEffect } from 'react';
import { getMyCourses } from '../../services/api'; // ✅ use api.js

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};

export default MyCoursesPage;