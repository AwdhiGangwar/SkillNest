import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new teacher dashboard
    navigate("/dashboard/teacher", { replace: true });
  }, [navigate]);

  return null;
}

export default TeacherDashboardRedirect;
