import React, { useState } from "react";
import CalendarComponent from "../../../components/dashboard/teacher/Calendar";

const Calendar = () => {
  const [scheduledClasses] = useState([
    { id: 1, name: "Rahul Kumar", subject: "Coding", title: "Math Basics", date: "2025-07-20", time: "18:00 - 19:00", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 2, name: "Sara Kapoor", subject: "Design", title: "UX Fundamentals", date: "2025-07-20", time: "19:00 - 20:00", status: "cancelled", avatar: "https://via.placeholder.com/32" },
    { id: 3, name: "Riya Verma", subject: "Coding", title: "Java 103", date: "2025-07-21", time: "20:00 - 21:00", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 4, name: "Vivaan Sharma", subject: "Design", title: "UI Design", date: "2025-07-20", time: "21:00 - 22:00", status: "scheduled", avatar: "https://via.placeholder.com/32" },
    { id: 5, name: "Kabir Joshi", subject: "Coding", title: "Java 205", date: "2025-07-22", time: "18:00 - 19:00", status: "scheduled", avatar: "https://via.placeholder.com/32" },
  ]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarComponent scheduledClasses={scheduledClasses} />
      </div>
    </div>
  );
};

export default Calendar;
