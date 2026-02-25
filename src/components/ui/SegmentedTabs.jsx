import React from "react";

const SegmentedTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="bg-[#144778] p-1 rounded-xl flex gap-2 w-fit shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              activeTab === tab
                ? "bg-white text-black"
                : "text-white"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SegmentedTabs;
