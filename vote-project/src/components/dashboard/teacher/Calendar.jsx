import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlotCard from "./SlotCard";
import Button from "../../ui/Button";

const times = ["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00"];

const DayCell = ({ status, isClickable = false }) => {
  const isAvailable = status === "available";
  return (
    <div
      className={`h-40 border rounded-lg p-3 flex flex-col justify-between transition-all ${
        isAvailable ? "bg-white border-gray-200 hover:shadow-md" : "bg-gray-100 border-gray-300 opacity-60"
      } ${isClickable ? "cursor-pointer" : ""}`}
    >
      <div className="text-xs font-medium text-gray-500">{isAvailable ? "Available" : "Not Available"}</div>
      <div className={`flex items-center justify-center h-12 rounded text-sm font-medium ${isAvailable ? "text-gray-700 bg-gray-50" : "text-gray-400"}`}>
        {/* Placeholder for class details */}
      </div>
    </div>
  );
};

const Calendar = ({ scheduledClasses = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get week range
  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  // Get days of week
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

  // Check if a class is scheduled for a specific day and time
  const getClassForSlot = (day, time) => {
    return scheduledClasses.find((c) => {
      const classDate = new Date(c.date);
      return (
        classDate.toDateString() === day.toDateString() &&
        c.time === time
      );
    });
  };

  return (
    <div className="bg-[#F7F7F7] rounded-2xl p-6 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <h3 className="text-2xl font-medium text-[#0D2232]">Class Schedule</h3>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <ChevronLeft size={18} className="text-blue-500" />
          </button>
          <span className="text-sm font-medium text-gray-700 px-3 min-w-fit">
            {formatDate(start)} – {formatDate(end)}
          </span>
          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <ChevronRight size={18} className="text-blue-500" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" className="border-blue-400 text-blue-500">
            ⚙ Preferences
          </Button>
          <Button variant="primary" size="md">
            ✏ Edit Slots
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full overflow-x-auto bg-white rounded-lg border border-gray-200">
        <div className="p-6 min-w-max">
          {/* Header: Day labels */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}>
            <div />
            {dayNames.map((d, idx) => (
              <div key={d} className="text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase">{d}</p>
                <p className="text-sm font-bold text-gray-900">{daysOfWeek[idx].getDate()}</p>
              </div>
            ))}
          </div>

          {/* Time rows */}
          {times.map((time) => (
            <div key={time} className="mb-8">
              <div className="grid gap-4 items-start" style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}>
                <div className="text-xs font-medium text-gray-600 pt-3">{time}</div>
                {daysOfWeek.map((day, dayIdx) => {
                  const scheduledClass = getClassForSlot(day, time);
                  return (
                    <div key={`${day}-${time}`} className="flex">
                      {scheduledClass ? (
                        <div className="flex-1">
                          <SlotCard
                            studentName={scheduledClass.name}
                            studentImage={scheduledClass.avatar}
                            subject={scheduledClass.subject}
                            time={time}
                            status={scheduledClass.status}
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <DayCell status="available" isClickable />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
