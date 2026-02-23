import React, { useState } from "react";
import TabButton from "./TabButton";

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="bg-purple-500 rounded-[5px] p-4 w-fit flex gap-4">

      {tabs.map((tab) => (
        <TabButton
          key={tab}
          label={tab}
          active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        />
      ))}

    </div>
  );
}

export default Tabs;
