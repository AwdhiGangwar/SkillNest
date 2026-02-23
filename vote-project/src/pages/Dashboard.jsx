import React, { useState } from "react";
import DatePicker from "../components/ui/DatePicker";
import AssignmentFileCard from "../components/ui/AssignmentFileCard";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import Pagination from "../components/ui/Pagination";
import StudentTag from "../components/ui/SubjectTag";
import EarningStatus from "../components/ui/EarningStatus";
import ClassAvailabilityStatus from "../components/ui/ClassAvailabilityStatus";
import GradeNote from "../components/ui/GradeNote";
import ClassScheduleStatus from "../components/ui/ClassScheduleStatus";
import GeneralStatusTag from "../components/ui/GeneralStatusTag";
import Sidebar from "../components/layout/Sidebar";
import NavBar from "../components/ui/NavBar";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "./auth/LoginForm";

const Dashboard = () => {
  const [date, setDate] = useState(null);
  const [isOn, setIsOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNavItem, setSelectedNavItem] = useState('dashboard');
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [showLoginTest, setShowLoginTest] = useState(false);
  return (
    <div style={{ display: 'flex', gap: '24px', minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="p-8 space-y-10 bg-gray-50 flex-1">
      
      <h1 className="text-2xl font-semibold">
        Dashboard (Component Testing)
      </h1>

      {/* Sidebar Test Info */}
      <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 space-y-2">
        <h2 className="font-medium text-lg text-blue-900">Sidebar Navigation</h2>
        <p className="text-sm text-blue-700">Check the left sidebar - Click the collapse/expand button to toggle between expanded and collapsed states.</p>
        <p className="text-sm text-blue-700">Try clicking different menu items to see the active state change.</p>
      </div>

      <h2 className="text-xl font-semibold mt-8">UI Components Testing</h2>

      {/* NavBar Test */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">NavBar Menu Items</h2>
          <button
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isNavExpanded ? 'Collapse' : 'Expand'} Items
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Selected Item: <span className="font-semibold text-blue-600">{selectedNavItem}</span></p>

        {/* Expanded NavBar */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">Expanded View:</p>
          <NavBar
            items={[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'calendar', icon: '📅', label: 'Calendar' },
              { id: 'students', icon: '👥', label: 'Students' }
            ]}
            selectedId={selectedNavItem}
            onItemClick={setSelectedNavItem}
            isExpanded={true}
          />
        </div>

        {/* Collapsed NavBar */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Collapsed View:</p>
          <NavBar
            items={[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'calendar', icon: '📅', label: 'Calendar' },
              { id: 'students', icon: '👥', label: 'Students' }
            ]}
            selectedId={selectedNavItem}
            onItemClick={setSelectedNavItem}
            isExpanded={false}
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">💡 Tip: Hover over items to see the hover state, click to select items</p>
      </div>

      {/* Date Picker Test */}
      <div className="bg-white p-6 rounded-xl shadow w-fit space-y-4">
        <h2 className="font-medium text-lg">Date Picker</h2>

        <DatePicker selected={date} onSelect={setDate} />

        <p className="text-sm text-gray-600">
          Selected Date: {date ? date.toDateString() : "None"}
        </p>
      </div>

      {/* Assignment Card Test */}
      <div className="bg-white p-6 rounded-xl shadow w-fit space-y-4">
        <h2 className="font-medium text-lg">Assignment File Card</h2>

        <AssignmentFileCard
          title="Assignment_User Interview"
          size="6.2 MB"
          onView={() => alert("Viewing File")}
        />
      </div>
  

<ToggleSwitch
  size="md"
  checked={isOn}
  onChange={setIsOn}
/>

      {/* Pagination Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">Pagination</h2>
        
        <div className="border border-gray-200 rounded p-4 mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Current Page: <span className="font-semibold">{currentPage}</span>
          </p>
          <Pagination 
            currentPage={currentPage}
            totalItems={36}
            itemsPerPage={12}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Student Tag Test */}
      <div className="bg-white p-6 rounded-xl shadow w-fit space-y-4">
        <h2 className="font-medium text-lg">Student Tag</h2>
        
        <StudentTag 
          tags={[
            { label: 'Coding', variant: 'coding' },
            { label: 'Design', variant: 'design' }
          ]}
        />
      </div>

      {/* Earning Status Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">Earning Status</h2>
        
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-600 mb-2">Paid</p>
            <EarningStatus status="paid" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Processing</p>
            <EarningStatus status="processing" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Failed</p>
            <EarningStatus status="failed" />
          </div>
        </div>
      </div>

      {/* Class Availability Status Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">Class Availability Status</h2>
        
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-600 mb-2">Available</p>
            <ClassAvailabilityStatus status="available" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Not Available</p>
            <ClassAvailabilityStatus status="notAvailable" />
          </div>
        </div>
      </div>

      {/* Grade Note Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">Grade Note</h2>
        
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-600 mb-2">Good</p>
            <GradeNote grade="good" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Average</p>
            <GradeNote grade="average" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Poor</p>
            <GradeNote grade="poor" />
          </div>
        </div>
      </div>

      {/* Class Schedule Status Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">Class Schedule Status</h2>
        
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-600 mb-2">Scheduled</p>
            <ClassScheduleStatus status="scheduled" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Ongoing</p>
            <ClassScheduleStatus status="ongoing" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Cancelled</p>
            <ClassScheduleStatus status="cancelled" />
          </div>
        </div>
      </div>

      {/* General Status Tag Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <h2 className="font-medium text-lg">General Status Tags</h2>
        
        <GeneralStatusTag 
          statuses={[
            'running',
            'success',
            'stopped',
            'preview',
            'draft',
            'coding',
            'testing',
            'paused',
            'deploying',
            'destroying',
            'error',
            'destroyed'
          ]}
        />
      </div>

      {/* Login Form Test */}
      <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Login Form</h2>
          <button
            onClick={() => setShowLoginTest(!showLoginTest)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showLoginTest ? 'Hide' : 'Show'} Login Form
          </button>
        </div>

        {showLoginTest ? (
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Click the "Show Login Form" button above to test the login form component. Try entering different values to test form validation.
          </p>
        )}
      </div>

      {/* Full Login Page Test */}
      {showLoginTest && (
        <div className="bg-white p-6 rounded-xl shadow w-full space-y-4">
          <h2 className="font-medium text-lg">Full Login Page Layout</h2>
          <p className="text-sm text-gray-600 mb-4">
            Below is the complete login page with AuthLayout (sidebar on left, form on right):
          </p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default Dashboard;