import React, { useState } from "react";
import { Search } from "lucide-react";
import StudentCard from "../../../components/ui/StudentCard";
import SegmentedTabs from "../../../components/ui/SegmentedTabs";

const Students = () => {
  const [activeTab, setActiveTab] = useState("All Students");
  const [searchQuery, setSearchQuery] = useState("");

  const allStudents = [
    { id: 1, name: "Vivaan Sharma", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "8th Grade", tag: "Design", status: "current" },
    { id: 2, name: "Sara Kapoor", image: "https://via.placeholder.com/120", country: "India", grade: "11th Grade", tag: "Design", status: "current" },
    { id: 3, name: "Riya Verma", image: "https://via.placeholder.com/120", country: "Australia", grade: "10th Grade", tag: "Coding", status: "past" },
    { id: 4, name: "Kabir Joshi", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "9th Grade", tag: "Coding", status: "current" },
    { id: 5, name: "Riya Verma", image: "https://via.placeholder.com/120", country: "Australia", grade: "10th Grade", tag: "Design", status: "current" },
    { id: 6, name: "Vivaan Sharma", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "8th Grade", tag: "Design", status: "past" },
    { id: 7, name: "Kabir Joshi", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "9th Grade", tag: "Coding", status: "current" },
    { id: 8, name: "Sara Kapoor", image: "https://via.placeholder.com/120", country: "India", grade: "11th Grade", tag: "Design", status: "past" },
    { id: 9, name: "Sara Kapoor", image: "https://via.placeholder.com/120", country: "India", grade: "11th Grade", tag: "Design", status: "current" },
    { id: 10, name: "Vivaan Sharma", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "8th Grade", tag: "Design", status: "past" },
    { id: 11, name: "Riya Verma", image: "https://via.placeholder.com/120", country: "Australia", grade: "10th Grade", tag: "Coding", status: "current" },
    { id: 12, name: "Kabir Joshi", image: "https://via.placeholder.com/120", country: "United Kingdom", grade: "9th Grade", tag: "Coding", status: "past" },
  ];

  // Filter students based on active tab
  const getFilteredStudents = () => {
    let filtered = allStudents;

    if (activeTab === "Current Students") {
      filtered = filtered.filter(s => s.status === "current");
    } else if (activeTab === "Past Students") {
      filtered = filtered.filter(s => s.status === "past");
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();
  const tabsArray = ["All Students", "Current Students", "Past Students"];

  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F7] rounded-2xl p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0D2232] mb-4">My Students</h2>

        {/* Tabs and Search */}
        <div className="flex items-center justify-between gap-4">
          {/* SegmentedTabs Component */}
          <SegmentedTabs 
            tabs={tabsArray}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 w-64">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex justify-center">
                <StudentCard
                  image={student.image}
                  name={student.name}
                  country={student.country}
                  grade={student.grade}
                  tag={student.tag}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
