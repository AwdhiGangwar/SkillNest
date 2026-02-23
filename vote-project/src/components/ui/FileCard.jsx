import { Eye } from "lucide-react";

const FileCard = ({
  title,
  size,
  icon,
  iconBg = "bg-yellow-100",
  onView,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm w-[304px]">

      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">

        {/* Icon */}
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>

        {/* File Info */}
        <div>
          <h4 className="text-sm font-semibold text-black">
            {title}
          </h4>
          <p className="text-xs text-gray-500">
            {size}
          </p>
        </div>

      </div>

      {/* View Button */}
      <button
        onClick={onView}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Eye size={18} />
      </button>

    </div>
  );
};

export default FileCard;