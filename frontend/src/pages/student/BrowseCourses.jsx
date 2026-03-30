import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCourses, enrollInCourse } from '../../services/api';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const { user } = useAuth();

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
      alert('✅ Enrollment Successful!');
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {course.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  ₹{course.price}
                </span>

                <button
                  onClick={() => handleEnroll(course.id, course.title)}
                  disabled={enrollingId === course.id}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  {enrollingId === course.id ? "Enrolling..." : "Enroll Now"}
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
    </div>
  );
};

export default BrowseCourses;