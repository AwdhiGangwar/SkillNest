const ProgressSidebar = ({ progress = 40 }) => {
  return (
    <div className="flex gap-6 h-[640px]">

      {/* Background Track */}
      <div className="w-2 bg-gray-200 rounded-md relative">
        {/* Filled */}
        <div
          className="w-1 bg-[#144778] rounded-md absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-500"
          style={{ height: `${progress}%` }}
        />
      </div>

    </div>
  );
};

export default ProgressSidebar;