import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NexusLayout from "./NexusLayout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Paths that handle their own authenticated state display gracefully
  const softProtectedPaths = ["/protocols"];
  const isSoftPath = softProtectedPaths.includes(location.pathname);

  console.log(
    `[PROTECTED_ROUTE_DEBUG] Path: ${location.pathname} | Loading: ${loading} | User:`,
    user ? user.role : "NULL",
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-label uppercase tracking-[0.3em] animate-pulse">
            Initializing Nexus...
          </span>
        </div>
      </div>
    );
  }

  // If not logged in and NOT a soft path, hard redirect to login with 'from' state
  if (!user && !isSoftPath) {
    console.warn(
      `[PROTECTED_ROUTE_DEBUG] Hard Redirect: No user. Saving location for return-to-source.`,
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but role not allowed (rare for common pages), redirect to their dashboard
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    console.error(
      `[PROTECTED_ROUTE_DEBUG] Role Mismatch. Expected: ${allowedRoles}, Got: ${user.role}`,
    );
    const dashboard =
      user.role === "ADMIN_ROLE"
        ? "/admin/dashboard"
        : user.role === "FACULTY_ROLE"
          ? "/faculty-dashboard"
          : "/student-dashboard";
    return <Navigate to={dashboard} replace />;
  }

  // For soft paths or allowed access, render with layout
  return <NexusLayout>{children}</NexusLayout>;
};

export default ProtectedRoute;
