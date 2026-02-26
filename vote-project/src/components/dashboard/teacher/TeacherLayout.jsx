import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#0D2232' }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area - Fixed dimensions */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 16px)', width: '100%' }}>
          <div className="mx-auto h-full w-full" style={{ maxWidth: '1400px', height: '100%' }}>
            <div style={{ 
              backgroundColor: '#F7F7F7', 
              borderRadius: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }} className="p-4">
              <div style={{ 
                flex: 1,
                overflow: 'auto',
                height: '100%',
                width: '100%'
              }}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}