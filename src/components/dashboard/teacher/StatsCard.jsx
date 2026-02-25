import React from "react";

const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      borderColor: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      borderColor: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      borderColor: "border-purple-200",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      borderColor: "border-orange-200",
    },
  };

  const colorScheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`${colorScheme.bg} border ${colorScheme.borderColor} rounded-lg p-6 flex items-center gap-4`}
    >
      {Icon && (
        <div className={`${colorScheme.text} text-3xl`}>
          <Icon size={32} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
