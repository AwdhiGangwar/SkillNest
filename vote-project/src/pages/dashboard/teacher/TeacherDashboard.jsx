import React, { useState, useRef } from "react";
import {
  Users,
  Clock,
  BookOpen,
  TrendingUp,
  Plus,
} from "lucide-react";
import StatsCard from "../../../components/dashboard/teacher/StatsCard";
import SlotCard from "../../../components/dashboard/teacher/SlotCard";
import WeekNavigator from "../../../components/dashboard/teacher/WeekNavigator";
import StudentCard from "../../../components/ui/StudentCard";

// Helper: horizontal scroll row that converts vertical wheel to horizontal scroll
function HorizontalScrollRow({ items }) {
  const rowRef = useRef(null);

  const onWheel = (e) => {
    const el = rowRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      // scroll horizontally with vertical wheel and prevent page scroll
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  return (
    <div
      ref={rowRef}
      onWheel={onWheel}
      className="flex gap-4 overflow-x-auto py-2 px-1"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {items.map((cls) => (
        <div key={cls.id} className="min-w-[260px]">
          <SlotCard
            studentName={cls.studentName}
            studentImage={cls.studentImage}
            subject={cls.subject}
            time={cls.time}
            status={cls.status}
          />
        </div>
      ))}
    </div>
  );
}

const TeacherDashboard = () => {
  const [upcomingClasses] = useState([
    {
      id: 1,
      studentName: "Emma Wilson",
      studentImage: "https://via.placeholder.com/40",
      subject: "Mathematics",
      time: "10:00 AM - 11:00 AM",
      status: "scheduled",
    },
    {
      id: 2,
      studentName: "Liam Smith",
      studentImage: "https://via.placeholder.com/40",
      subject: "Physics",
      time: "11:30 AM - 12:30 PM",
      status: "scheduled",
    },
    {
      id: 3,
      studentName: "Sophia Brown",
      studentImage: "https://via.placeholder.com/40",
      subject: "Chemistry",
      time: "2:00 PM - 3:00 PM",
      status: "scheduled",
    },
  ]);

  const [completedClasses] = useState([
    {
      id: 4,
      studentName: "Oliver Davis",
      studentImage: "https://via.placeholder.com/40",
      subject: "Biology",
      time: "Yesterday 3:00 PM",
      status: "completed",
    },
    {
      id: 5,
      studentName: "Ava Miller",
      studentImage: "https://via.placeholder.com/40",
      subject: "English",
      time: "2 days ago 2:00 PM",
      status: "completed",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 ">
            <div>
              <h2 className="text-3xl font-medium" style={{ color: '#0D2232', lineHeight: '43px' }}>Welcome back, Harshit</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">🎁</div>
              <button className="text-sm font-semibold text-[#1F80E0]">Claim Reward</button>
            </div>
          </div>

          {/* Main area */}
          <div className="space-y-6 w-full">

            {/* Stats row */}
            <div className="flex gap-6">
              <StatsCard icon={Users} label="Total Students" value="24" />
              <StatsCard icon={BookOpen} label="Active Classes" value="12" />
              <StatsCard icon={Clock} label="Hours This Week" value="18.5" />
              <StatsCard icon={TrendingUp} label="Student Performance" value="87%" />
            </div>

            {/* Week navigator */}
            <div>
              <WeekNavigator />
            </div>

            {/* Two column content */}
            <div className="flex flex-col gap-6">
              {/* Left - Upcoming Classes */}
              <div className="w-full">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
                      <p className="text-sm text-gray-600">Your scheduled sessions for today</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <Plus size={16} />
                      <span>Schedule</span>
                    </button>
                  </div>

                  {/* Horizontal Slot Cards */}
                  <div className="mb-3">
                    <HorizontalScrollRow items={upcomingClasses} />
                  </div>

                  <button className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    View All Classes
                  </button>
                </div>
              </div>

              {/* Right - Quick Actions, Completed, My Students */}
              <div className="w-full flex flex-col gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-base font-semibold mb-3">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">Create Assignment</button>
                    <button className="w-full px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">Check Submissions</button>
                    <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg">Grade Papers</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-base font-semibold mb-3">Recently Completed</h4>
                  <div className="space-y-3">
                    {completedClasses.map((cls) => (
                      <SlotCard
                        key={cls.id}
                        studentName={cls.studentName}
                        studentImage={cls.studentImage}
                        subject={cls.subject}
                        time={cls.time}
                        status={cls.status}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold">My Students</h4>
                    <button className="text-sm text-[#1F80E0]">View all</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <StudentCard image={upcomingClasses[0].studentImage} name="Vivaan Sharma" country="United Kingdom" grade="8th Grade" tag="Design" />
                    <StudentCard image={upcomingClasses[1].studentImage} name="Rahul Kumar" country="India" grade="7th Grade" tag="Coding" />
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default TeacherDashboard;
