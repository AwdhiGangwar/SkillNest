import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WeekNavigator = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
  };

  const getDaysOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const { start, end } = getWeekRange(currentDate);
  const daysOfWeek = getDaysOfWeek(currentDate);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Week Schedule</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 px-4 py-2 bg-gray-50 rounded-lg min-w-fit">
            {formatDate(start)} - {formatDate(end)}
          </span>
          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg min-w-max ${
              day.toDateString() === new Date().toDateString()
                ? "bg-blue-100 border border-blue-300"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p className="text-xs font-medium text-gray-600">
              {dayNames[day.getDay()]}
            </p>
            <p className="text-sm font-bold text-gray-900">{day.getDate()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekNavigator;
