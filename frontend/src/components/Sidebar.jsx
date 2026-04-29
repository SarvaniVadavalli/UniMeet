import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "STUDENT_ROLE") return "/student-dashboard";
    if (user.role === "FACULTY_ROLE") return "/faculty-dashboard";
    if (user.role === "ADMIN_ROLE") return "/admin/dashboard";
    return "/";
  };

  const isInfoPage = location.pathname === "/protocols";

  const linkClass = (path) =>
    location.pathname === path
      ? "flex items-center gap-4 px-6 py-4 text-[#c7fffe] border-l-4 border-[#00f0f0] bg-gradient-to-r from-[#00f0f0]/10 to-transparent scale-[0.98] transition-transform duration-150"
      : "flex items-center gap-4 px-6 py-4 text-[#c7fffe]/60 border-l-4 border-transparent hover:bg-[#c7fffe]/5 hover:text-[#c7fffe] transition-colors";

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col pt-20 pb-6 z-40 bg-[#1a221d] border-r border-outline-variant/10">
      <div className="flex-1 space-y-1">
        {isInfoPage ? (
          <>
            <Link to="/" className={linkClass("/")} title="Return to Home">
              <span className="material-symbols-outlined">home</span>
              <span className="font-['Inter'] font-semibold text-sm">
                Back to Home
              </span>
            </Link>
            {user && (
              <Link
                to={getDashboardLink()}
                className={linkClass(getDashboardLink())}
                title="Return to Dashboard"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-['Inter'] font-medium text-sm">
                  Dashboard
                </span>
              </Link>
            )}
            <Link
              to="/protocols"
              className={linkClass("/protocols")}
              title="System Operation Protocols"
            >
              <span className="material-symbols-outlined">terminal</span>
              <span className="font-['Inter'] font-medium text-sm">
                Protocols
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to={getDashboardLink()}
              className={linkClass(getDashboardLink())}
              title="Return to Dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-['Inter'] font-semibold text-sm">
                Dashboard
              </span>
            </Link>

            {user?.role === "STUDENT_ROLE" && (
              <>
                <Link
                  to="/browse-faculty"
                  className={linkClass("/browse-faculty")}
                  title="Find required faculty for booking slots"
                >
                  <span className="material-symbols-outlined">search</span>
                  <span className="font-['Inter'] font-medium text-sm">
                    Browse Faculty
                  </span>
                </Link>
                <Link
                  to="/appointments"
                  className={linkClass("/appointments")}
                  title="Manage your booked appointments"
                >
                  <span className="material-symbols-outlined">event</span>
                  <span className="font-['Inter'] font-medium text-sm">
                    My Appointments
                  </span>
                </Link>
              </>
            )}

            {user?.role === "FACULTY_ROLE" && (
              <>
                <Link
                  to="/manage-slots"
                  className={linkClass("/manage-slots")}
                  title="Open or edit your availability"
                >
                  <span className="material-symbols-outlined">
                    event_available
                  </span>
                  <span className="font-['Inter'] font-medium text-sm">
                    Manage Slots
                  </span>
                </Link>
                <Link
                  to="/appointment-requests"
                  className={linkClass("/appointment-requests")}
                  title="Approve or reject student booking requests"
                >
                  <span className="material-symbols-outlined">assignment</span>
                  <span className="font-['Inter'] font-medium text-sm">
                    Appointment Requests
                  </span>
                </Link>
              </>
            )}

            {user?.role === "ADMIN_ROLE" && (
              <>
                <Link
                  to="/admin/users"
                  className={linkClass("/admin/users")}
                  title="Manage all system users"
                >
                  <span className="material-symbols-outlined">group</span>
                  <span className="font-['Inter'] font-medium text-sm">
                    User Management
                  </span>
                </Link>
                <Link
                  to="/admin/appointments"
                  className={linkClass("/admin/appointments")}
                  title="Global view of all system appointments"
                >
                  <span className="material-symbols-outlined">event_note</span>
                  <span className="font-['Inter'] font-medium text-sm">
                    Appointments Overview
                  </span>
                </Link>
                <Link
                  to="/admin/issues"
                  className={linkClass("/admin/issues")}
                  title="Manage system issues and complaints"
                >
                  <span className="material-symbols-outlined">
                    report_problem
                  </span>
                  <span className="font-['Inter'] font-medium text-sm">
                    Issue Management
                  </span>
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="px-6 space-y-1 border-t border-outline-variant/10 pt-4">
        <div className="py-2 mb-2">
          <p className="text-[10px] font-label uppercase tracking-widest text-primary/60">
            {user ? user.role.replace("_ROLE", "") : "Guest"}
          </p>
          <p className="font-headline text-on-surface text-sm font-semibold">
            {user ? user.name : ""}
          </p>
        </div>
        {user?.role !== "ADMIN_ROLE" && (
          <Link
            to="/report-issue"
            className={`w-full flex items-center gap-4 py-2 hover:text-[#c7fffe] transition-colors ${location.pathname === "/report-issue" ? "text-primary" : "text-[#c7fffe]/60"}`}
          >
            <span className="material-symbols-outlined text-sm">
              bug_report
            </span>
            <span
              className={`font-['Inter'] text-sm ${location.pathname === "/report-issue" ? "font-bold" : "font-medium"}`}
            >
              Report Issue
            </span>
          </Link>
        )}
        <Link
          to="/settings"
          className={`w-full flex items-center gap-4 py-2 hover:text-[#c7fffe] transition-colors ${location.pathname === "/settings" ? "text-primary" : "text-[#c7fffe]/60"}`}
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          <span
            className={`font-['Inter'] text-sm ${location.pathname === "/settings" ? "font-bold" : "font-medium"}`}
          >
            Settings
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 py-2 text-error/80 hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="font-['Inter'] font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
