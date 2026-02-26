import React, { useState } from "react";
import StudentCard from "../../../components/ui/StudentCard";
import Pagination from "../../../components/ui/Pagination";

const TeacherDashboard = () => {
  const [upcomingClasses] = useState([
    { id: 1, name: "Rahul Kumar", subject: "Coding", title: "Math Basics", date: "20 July, 2025", time: "10:00 PM - 11:00 PM", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 2, name: "Sara Kapoor", subject: "Design", title: "UX Fundamentals", date: "20 July, 2025", time: "11:00 PM - 12:00 PM", status: "cancelled", avatar: "https://via.placeholder.com/32" },
    { id: 3, name: "Riya Verma", subject: "Coding", title: "Java 103", date: "21 July, 2025", time: "07:00 PM - 08:00 PM", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 4, name: "Vivaan Sharma", subject: "Design", title: "UI Design", date: "20 July, 2025", time: "10:00 PM - 11:00 PM", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 5, name: "Kabir Joshi", subject: "Coding", title: "Java 205", date: "20 July, 2025", time: "10:00 PM - 11:00 PM", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 6, name: "Extra Student", subject: "Coding", title: "Extra", date: "22 July, 2025", time: "09:00 AM - 10:00 AM", status: "scheduled", avatar: "https://via.placeholder.com/32" },
  ]);

  const [students] = useState([
    { id: 1, name: 'Vivaan Sharma', image: 'https://via.placeholder.com/120', country: 'United Kingdom', grade: '8th Grade', tag: 'Design' },
    { id: 2, name: 'Riya Verma', image: 'https://via.placeholder.com/120', country: 'Australia', grade: '10th Grade', tag: 'Design' },
    { id: 3, name: 'Sara Kapoor', image: 'https://via.placeholder.com/120', country: 'India', grade: '11th Grade', tag: 'Design' },
    { id: 4, name: 'Kabir Joshi', image: 'https://via.placeholder.com/120', country: 'United Kingdom', grade: '9th Grade', tag: 'Coding' },
  ]);

  // pagination state for upcoming classes table
  const [page, setPage] = useState(1);
  const perPage = 5;
  const total = upcomingClasses.length;
  const start = (page - 1) * perPage;
  const visibleClasses = upcomingClasses.slice(start, start + perPage);

  return (
    <div style={{ width: 1200, height: 992 }} className="bg-[#F7F7F7] rounded-2xl p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" style={{ width: 800, height: 43 }}>
        <h3 style={{ fontFamily: 'General Sans', fontWeight: 500, fontSize: 32, lineHeight: '43px', color: '#0D2232' }}>Welcome back, Harshit</h3>
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32 }} className="rounded bg-white flex items-center justify-center">🎁</div>
          <button style={{ fontWeight: 600, fontSize: 16 }} className="text-[#1F80E0]">Refer for Rewards</button>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ width: 800 }} className="space-y-6">
        {/* Upcoming Classes panel */}
        <div style={{ width: 1120 }} className="bg-white rounded-lg border border-[#E9F3FC] shadow-sm">
          <div className="flex items-center justify-between px-4 py-4" style={{ background: '#F5F9FF', borderRadius: '8px 8px 0 0' }}>
            <div>
              <h4 style={{ fontFamily: 'General Sans', fontWeight: 500, fontSize: 20 }}>Upcoming Classes</h4>
            </div>
            <button className="text-sm text-[#1F80E0]">View All</button>
          </div>

          {/* Table header */}
          <div className="flex items-center px-4 py-3 gap-4" style={{ borderBottom: '1px solid #F2F2F2' }}>
            <div style={{ width: 240 }} className="flex items-center">Student Name</div>
            <div style={{ width: 104 }} className="text-sm font-medium">Course</div>
            <div style={{ width: 120 }} className="text-sm font-medium">Class Title</div>
            <div style={{ width: 96 }} className="text-sm font-medium">Date</div>
            <div style={{ width: 120 }} className="text-sm font-medium">Time</div>
            <div style={{ width: 120 }} className="text-sm font-medium">Class Status</div>
            <div style={{ width: 66 }} className="text-sm font-medium"></div>
          </div>

          {/* Rows */}
          <div className="px-4 py-2">
            {visibleClasses.map((c) => (
              <div key={c.id} className="flex items-center px-4 py-3 rounded-md" style={{ borderBottom: '1px solid #F2F2F2' }}>
                <div style={{ width: 240 }} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm font-medium text-[#4F4F4F]">{c.name}</div>
                </div>

                <div style={{ width: 104 }} className="text-sm">{c.subject}</div>
                <div style={{ width: 120 }} className="text-sm text-[#4F4F4F]">{c.title}</div>
                <div style={{ width: 96 }} className="text-sm">{c.date}</div>
                <div style={{ width: 120 }} className="text-sm">{c.time}</div>
                <div style={{ width: 120 }} className="text-sm">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${c.status === 'scheduled' ? 'text-[#27AE60]' : c.status === 'cancelled' ? 'text-[#C83333]' : 'text-gray-700'}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>

                <div style={{ width: 66 }} className="flex justify-end">
                  <button className="px-3 py-1 text-sm border rounded text-[#1F80E0]">Join</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination and results info */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-[#4F4F4F]">Showing {String(start + 1).padStart(2,'0')}-{String(Math.min(start + perPage, total)).padStart(2,'0')} of {total} results</div>
            <div style={{ width: 151 }}>
              <Pagination currentPage={page} totalItems={total} itemsPerPage={perPage} onPageChange={setPage} />
            </div>
          </div>
        </div>

        {/* My Students panel */}
        <div style={{ width: 1120 }} className="bg-white rounded-lg border border-[#F2F2F2] p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 style={{ fontFamily: 'General Sans', fontWeight: 500, fontSize: 20 }}>My Students</h4>
            <button className="text-sm text-[#1F80E0]">View All</button>
          </div>

          <div className="flex gap-6">
            {students.map((s) => (
              <div key={s.id} style={{ width: 271.5 }}>
                <StudentCard image={s.image} name={s.name} country={s.country} grade={s.grade} tag={s.tag} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
