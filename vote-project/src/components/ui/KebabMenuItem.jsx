const KebabMenuItem = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900">
        {label}
      </span>
    </div>
  );
};

export default KebabMenuItem;