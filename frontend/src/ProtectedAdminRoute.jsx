import { Navigate } from "react-router-dom";

//  Superadmin Route Protection
export function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.roleID?.name?.toLowerCase() !== "superadmin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

//  Seeker Route Protection
export function ProtectedSeekerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.roleID?.name?.toLowerCase() !== "seeker") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

//  Employer Route Protection
export function ProtectedEmployerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.roleID?.name?.toLowerCase() !== "employer") {
    return <Navigate to="/login" replace />;
  }

  return children;
}



//  Employer Route Protection
export function ProtectedMentorRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.roleID?.name?.toLowerCase() !== "mentor") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}