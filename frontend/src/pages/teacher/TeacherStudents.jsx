// src/pages/teacher/TeacherStudents.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, EmptyState, Table } from "../../components/ui";
import { getTeacherClasses, getAllCourses, getEnrollmentsByCourse, getUserById } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function TeacherStudents() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { profile } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch all courses and filter those taught by this teacher
        const coursesRes = await getAllCourses();
        const all = coursesRes.data || [];
        const myCourses = all.filter(c => (c.teacherIds || []).includes(profile?.id) || c.teacherId === profile?.id);

        // 2. For each course fetch enrollments
        const enrollPromises = myCourses.map(c => getEnrollmentsByCourse(c.id).then(r => ({ course: c, enrollments: r.data || [] })).catch(() => ({ course: c, enrollments: [] })));
        const courseEnrollments = await Promise.all(enrollPromises);

        // 3. Build classes-like entries from enrollments for table reuse
        const cls = [];
        const studentIdSet = new Set();
        for (const ce of courseEnrollments) {
          const course = ce.course;
          const enrolls = ce.enrollments || [];
          enrolls.forEach(en => {
            const sId = en.studentId;
            studentIdSet.add(sId);
            cls.push({
              studentId: sId,
              studentName: en.studentName || sId,
              studentEmail: en.studentEmail || en.email || "—",
              courseId: course.id,
              courseName: course.title,
              status: en.status || "enrolled",
              startTime: en.enrollmentDate ? new Date(en.enrollmentDate).getTime() : null,
            });
          });
        }

        // 4. Optionally enrich students with user details (fetch in parallel)
        const studentIds = Array.from(studentIdSet).filter(Boolean);
        const userPromises = studentIds.map(id => getUserById(id).then(r => ({ id, user: r.data })).catch(() => ({ id, user: null })));
        const users = await Promise.all(userPromises);
        const userMap = {};
        users.forEach(u => { if (u.user) userMap[u.id] = u.user; });

        // 5. Attach user details to cls entries
        const enriched = cls.map(item => ({
          ...item,
          studentName: (userMap[item.studentId]?.name) || item.studentName,
          studentEmail: (userMap[item.studentId]?.email) || item.studentEmail,
        }));

        setClasses(enriched);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profile]);

  // Build unique students from classes
  const studentMap = {};
  classes.forEach((cls) => {
    if (!cls.studentId) return;
    if (!studentMap[cls.studentId]) {
      studentMap[cls.studentId] = {
        id: cls.studentId,
        name: cls.studentName || cls.studentId.slice(0, 12) + "...",
        email: cls.studentEmail || "—",
        course: cls.courseId || "—",
        totalClasses: 0,
        completedClasses: 0,
        nextClass: null,
      };
    }
    studentMap[cls.studentId].totalClasses++;
    if (cls.status === "completed") studentMap[cls.studentId].completedClasses++;
    if (
      cls.status === "scheduled" &&
      cls.startTime &&
      (!studentMap[cls.studentId].nextClass ||
        cls.startTime < studentMap[cls.studentId].nextClass)
    ) {
      studentMap[cls.studentId].nextClass = cls.startTime;
    }
  });

  const students = Object.values(studentMap).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
            {val?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{val}</div>
            <div className="text-xs text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "course", label: "Course", render: (val) => <span className="text-xs text-slate-300">{val}</span> },
    {
      key: "completedClasses",
      label: "Completed",
      render: (val, row) => (
        <span className="text-sm font-semibold text-white">{val}/{row.totalClasses}</span>
      ),
    },
    {
      key: "completedClasses",
      label: "Attendance",
      render: (val, row) => {
        const pct = row.totalClasses > 0 ? Math.round((val / row.totalClasses) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-emerald-400 font-medium">{pct}%</span>
          </div>
        );
      },
    },
    {
      key: "nextClass",
      label: "Next Class",
      render: (val) =>
        val ? (
          <span className="text-xs text-slate-300">
            {new Date(val).toLocaleDateString("en-US", {
              month: "short", day: "numeric",
            })}
          </span>
        ) : (
          <span className="text-xs text-slate-500">None scheduled</span>
        ),
    },
  ];

  return (
    <Layout
      title="Students"
      subtitle={`${students.length} student${students.length !== 1 ? "s" : ""} in your classes`}
    >
      <div className="mb-6">
        <div className="relative max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="space-y-4">{Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : students.length === 0 ? (
          <EmptyState
            icon="◉"
            title="No students yet"
            description="Students will appear here once they enroll in your courses and book classes"
          />
        ) : (
          <Table columns={columns} data={students} />
        )}
      </div>
    </Layout>
  );
}
