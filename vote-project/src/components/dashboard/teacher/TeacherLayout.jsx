import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#0D2232' }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="w-full flex-shrink-0">
          <Topbar />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full" style={{ maxWidth: 1200 }}>
            <div style={{ backgroundColor: '#F7F7F7', borderRadius: 24 }} className="p-6">
              <Outlet />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}