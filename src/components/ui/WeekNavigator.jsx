import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const WeekNavigator = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const { start, end } = getWeekRange(currentDate);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  return (
    <div className="flex items-center gap-2">

      {/* Previous */}
      <button
        onClick={() => changeWeek(-1)}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Date Range */}
      <div className="h-12 px-6 flex items-center bg-white border border-gray-200 rounded-xl shadow-sm font-semibold">
        {formatDate(start)} - {formatDate(end)}
      </div>

      {/* Next */}
      <button
        onClick={() => changeWeek(1)}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
};

export default WeekNavigator;