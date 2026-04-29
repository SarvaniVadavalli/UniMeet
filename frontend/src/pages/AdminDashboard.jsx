import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getGlobalStats,
  getAllUsers,
  getAllAppointments,
  deleteUser,
} from "../services/adminService";
import { getAllIssues, updateIssueStatus } from "../services/issueService";
import toast from "react-hot-toast";
import NexusModal from "../components/NexusModal";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isUsersView = location.pathname === "/admin/users";
  const isAppointmentsView = location.pathname === "/admin/appointments";
  const isIssuesView = location.pathname === "/admin/issues";

  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    appointments: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isUsersView) {
          const data = await getAllUsers();
          setUsers(data);
        } else if (isAppointmentsView) {
          const data = await getAllAppointments();
          setAppointments(data);
        } else if (isIssuesView) {
          const data = await getAllIssues();
          setIssues(data);
        } else {
          const [statsData, appsData] = await Promise.all([
            getGlobalStats(),
            getAllAppointments(),
          ]);
          setStats(statsData);
          setAppointments(appsData.slice(0, 5));
        }
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        const errorMsg =
          err.response?.data?.message || err.message || "System uplink failed";
        toast.error(`Sync Failure: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, isUsersView, isAppointmentsView, isIssuesView]);

  const handleExport = () => {
    if (appointments.length === 0) {
      toast.error("No data available for extraction");
      return;
    }

    const headers = [
      "REF ID",
      "Student",
      "Faculty",
      "Date",
      "Status",
      "Agenda",
    ];
    const rows = appointments.map((app) => [
      `"#${app._id.slice(-8).toUpperCase()}"`,
      `"${(app.studentId?.name || "N/A").replace(/"/g, '""')}"`,
      `"${(app.facultyId?.name || "N/A").replace(/"/g, '""')}"`,
      `"${app.slotId ? format(new Date(app.slotId.startTime), "dd MMM yyyy HH:mm") : "N/A"}"`,
      `"${app.status}"`,
      `"${(app.agenda || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `unimeet_report_${format(new Date(), "yyyyMMdd_HHmm")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Telemetry report generated successfully");
  };

  const handleUpdateIssue = async (id, status) => {
    try {
      await updateIssueStatus(id, status);
      toast.success(`Issue status updated to ${status}`);
      const data = await getAllIssues();
      setIssues(data);
    } catch (error) {
      toast.error("Failed to update issue");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsModalOpen(false);
    try {
      await deleteUser(userToDelete);
      toast.success("User eradicated cleanly");
      // Refresh local user state
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === "ALL") return true;
    return app.status === statusFilter;
  });

  return (
    <div className="w-full">
      {/* Page Header (Asymmetric) */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-8 border-b border-outline-variant/20 pb-6">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-headline font-bold tracking-tight text-[#c7fffe] mb-2 leading-none uppercase">
            {isUsersView
              ? "User Management"
              : isAppointmentsView
                ? "Appointments Overview"
                : isIssuesView
                  ? "Issue Management"
                  : "Admin Dashboard"}
          </h2>
          <p className="text-sm font-label text-[#c7fffe]/60 max-w-lg mb-2">
            {isUsersView
              ? "Complete directory of all registered personnel and access control."
              : isAppointmentsView
                ? "Global viewport of all cross-departmental booking requests."
                : isIssuesView
                  ? "Review and resolve reported complaints and technical system anomalies."
                  : "Centralized administrative hub for appointment monitoring and platform usage analytics."}
          </p>
          <p className="text-on-surface-variant font-label tracking-widest uppercase text-xs">
            System Administrator: {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="p-4 bg-primary/10 border border-primary/30 text-primary font-headline font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-primary/20 transition-all flex items-center gap-2 chamfer-tr"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Generate Report
          </button>
          <div className="flex gap-2">
            <div className="p-4 bg-surface-container-low border border-outline-variant/30 chamfer-tr min-w-[140px]">
              <p className="text-[10px] text-[#c7fffe]/40 font-headline tracking-widest uppercase">
                Platform Reach
              </p>
              <p className="text-xl font-headline text-primary">
                {loading ? "--" : stats.students + stats.faculty} USERS
              </p>
            </div>
            <div className="p-4 bg-surface-container-low border border-outline-variant/30 chamfer-tr min-w-[140px]">
              <p className="text-[10px] text-[#c7fffe]/40 font-headline tracking-widest uppercase">
                Response Queue
              </p>
              <p className="text-xl font-headline text-secondary">
                {loading ? "--" : stats.pending} PENDING
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Switching */}
      {isUsersView && (
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1 bg-surface-container-low p-6 border border-[#c7fffe]/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#c7fffe] uppercase tracking-widest">
                  Active Personnel
                </h3>
                <p className="text-[10px] text-[#c7fffe]/40 tracking-widest font-label uppercase">
                  Manage existing roles and system access
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#c7fffe]/10">
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      NAME
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      EMAIL ENCRYPTION
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      ROLE ASSIGNMENT
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      DATE REGISTERED
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline text-right">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7fffe]/5">
                  {loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase animate-pulse"
                      >
                        Loading Directory...
                      </td>
                    </tr>
                  )}
                  {!loading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase"
                      >
                        No users detected.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="group hover:bg-[#c7fffe]/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-[12px] font-bold text-[#c7fffe] uppercase">
                          {u.name}
                        </td>
                        <td className="py-4 px-4 text-[11px] font-mono text-[#c7fffe]/60 tracking-tight">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-[9px] px-2 py-0.5 border uppercase font-bold tracking-widest ${
                              u.role === "ADMIN_ROLE"
                                ? "border-primary/20 text-primary"
                                : u.role === "FACULTY_ROLE"
                                  ? "border-[#c7fffe]/20 text-[#c7fffe]/80"
                                  : "border-secondary/20 text-secondary"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-[#c7fffe]/40 font-mono">
                          {format(new Date(u.createdAt), "MMM dd yyyy")}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {u.role !== "ADMIN_ROLE" ? (
                            <button
                              onClick={() => {
                                setUserToDelete(u._id);
                                setIsModalOpen(true);
                              }}
                              className="text-error hover:text-error-container transition-colors"
                              title="Eradicate User"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete_forever
                              </span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-label text-primary/40 uppercase tracking-widest">
                              PROTECTED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isAppointmentsView && (
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1 bg-surface-container-low p-6 border border-[#c7fffe]/5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#c7fffe] uppercase tracking-widest">
                  Global Appointments Trace
                </h3>
                <p className="text-[10px] text-[#c7fffe]/40 tracking-widest font-label uppercase">
                  Monitor and verify all system bookings
                </p>
              </div>
              <div className="flex divide-x divide-outline-variant/20 border border-outline-variant/30 rounded-sm">
                {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${statusFilter === status ? "bg-primary text-on-primary" : "text-outline-variant hover:text-[#c7fffe] bg-transparent"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#c7fffe]/10">
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      REF ID
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      STUDENT & FACULTY
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      AGENDA LOG
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      DATE & TIME
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline text-right">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7fffe]/5">
                  {loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase animate-pulse"
                      >
                        Scanning Timelines...
                      </td>
                    </tr>
                  )}
                  {!loading && filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase"
                      >
                        No Appointments Matching Query.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    filteredAppointments.map((app) => (
                      <tr
                        key={app._id}
                        className="group hover:bg-[#c7fffe]/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-[11px] font-mono text-[#c7fffe]">
                          #{app._id.substring(0, 8)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[12px] font-bold text-[#c7fffe] uppercase tracking-tight">
                              {app.studentId?.name}
                            </span>
                            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
                              TO: Prof. {app.facultyId?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-[#c7fffe]/60 font-body uppercase max-w-[200px] truncate">
                          {app.agenda || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-[11px] text-[#c7fffe]/40 font-mono">
                          {app.slotId
                            ? format(
                                new Date(app.slotId.startTime),
                                "MMM dd, yyyy _ HH:mm",
                              )
                            : "UNK_TIME"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`text-[9px] px-2 py-1 border uppercase font-bold tracking-widest ${
                              app.status === "APPROVED"
                                ? "border-[#c7fffe]/20 text-[#c7fffe]/80 bg-[#c7fffe]/10"
                                : app.status === "PENDING"
                                  ? "border-secondary/20 text-secondary bg-secondary/10"
                                  : "border-error/20 text-error bg-error/10"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isIssuesView && (
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1 bg-surface-container-low p-6 border border-[#c7fffe]/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#c7fffe] uppercase tracking-widest">
                  System Issue Registry
                </h3>
                <p className="text-[10px] text-[#c7fffe]/40 tracking-widest font-label uppercase">
                  Resolve reported anomalies and grievances
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c7fffe]/10">
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      REPORTER
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      SUBJECT & CATEGORY
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      URGENCY
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      STATUS
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline text-right">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7fffe]/5">
                  {loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase animate-pulse"
                      >
                        Scanning Logs...
                      </td>
                    </tr>
                  )}
                  {!loading && issues.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase"
                      >
                        No Active Issues Detected.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    issues.map((issue) => (
                      <tr
                        key={issue._id}
                        className="group hover:bg-[#c7fffe]/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[12px] font-bold text-[#c7fffe] uppercase">
                              {issue.reporter?.name}
                            </span>
                            <span className="text-[9px] font-label text-secondary uppercase tracking-widest">
                              {issue.reporter?.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[12px] font-bold text-[#c7fffe] uppercase">
                              {issue.subject}
                            </span>
                            <span className="text-[9px] font-label text-[#c7fffe]/40 uppercase tracking-widest">
                              {issue.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-[9px] px-2 py-0.5 border uppercase font-bold tracking-widest ${
                              issue.priority === "CRITICAL"
                                ? "border-error text-error bg-error/10"
                                : issue.priority === "HIGH"
                                  ? "border-secondary text-secondary"
                                  : "border-[#c7fffe]/20 text-[#c7fffe]/60"
                            }`}
                          >
                            {issue.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                issue.status === "RESOLVED"
                                  ? "bg-primary"
                                  : issue.status === "OPEN"
                                    ? "bg-error animate-pulse"
                                    : "bg-secondary"
                              }`}
                            ></span>
                            <span className="text-[10px] font-bold text-[#c7fffe]/80 uppercase">
                              {issue.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <select
                            onChange={(e) =>
                              handleUpdateIssue(issue._id, e.target.value)
                            }
                            value={issue.status}
                            className="bg-surface-container border border-outline-variant/30 text-[9px] font-bold uppercase tracking-widest p-1 text-primary focus:outline-none"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">Processing</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!isUsersView && !isAppointmentsView && !isIssuesView && (
        <div className="grid grid-cols-12 gap-6">
          {/* FACULTY_WORKLOAD (Asymmetric Bento) -> Now Real Analytics */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-low/60 backdrop-blur-md p-6 border border-[#c7fffe]/5 chamfer-tr relative group">
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#c7fffe]/40 -mr-1 -mt-1 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-headline font-bold text-[#c7fffe] uppercase tracking-tight">
                  System Analytics Overview
                </h3>
                <p className="text-[10px] text-[#c7fffe]/40 tracking-[0.2em] font-label uppercase mt-1">
                  Aggregated Usage Statistics
                </p>
              </div>
              <span className="material-symbols-outlined text-[#c7fffe]/40">
                analytics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 h-64 relative">
              <div className="bg-[#c7fffe]/5 p-6 border-l-2 border-primary flex flex-col justify-end">
                <span className="text-[10px] font-label tracking-widest text-[#c7fffe]/60 uppercase">
                  Total Students
                </span>
                <span className="text-5xl font-headline font-bold text-primary">
                  {loading ? "--" : stats.students}
                </span>
              </div>
              <div className="bg-[#c7fffe]/5 p-6 border-l-2 border-secondary flex flex-col justify-end">
                <span className="text-[10px] font-label tracking-widest text-[#c7fffe]/60 uppercase">
                  Total Faculty
                </span>
                <span className="text-5xl font-headline font-bold text-secondary">
                  {loading ? "--" : stats.faculty}
                </span>
              </div>
              <div className="bg-[#c7fffe]/5 p-6 border-l-2 border-error flex flex-col justify-end">
                <span className="text-[10px] font-label tracking-widest text-[#c7fffe]/60 uppercase">
                  Pending Validation
                </span>
                <span className="text-5xl font-headline font-bold text-error">
                  {loading ? "--" : stats.pending}
                </span>
              </div>
              <div className="bg-[#c7fffe]/5 p-6 border-l-2 border-[#c7fffe] flex flex-col justify-end">
                <span className="text-[10px] font-label tracking-widest text-[#c7fffe]/60 uppercase">
                  Gross Appointments
                </span>
                <span className="text-5xl font-headline font-bold text-[#c7fffe]">
                  {loading ? "--" : stats.appointments}
                </span>
              </div>
            </div>
          </div>

          {/* SYSTEM_UPTIME (Segmented Rings) */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 backdrop-blur-md p-6 border border-[#c7fffe]/5 chamfer-tr relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-headline font-bold text-[#c7fffe] uppercase tracking-tight">
                Session Lifecycle
              </h3>
              <p className="text-[10px] text-[#c7fffe]/40 tracking-[0.2em] font-label uppercase mt-1">
                Status Distribution Matrix
              </p>
            </div>
            <div className="mt-8 space-y-6">
              {/* Approved Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-label">
                  <span className="text-primary uppercase tracking-widest font-bold">
                    Approved / Confirmed
                  </span>
                  <span className="text-primary font-mono">
                    {stats.appointments > 0
                      ? ((stats.approved / stats.appointments) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest/30">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width: `${stats.appointments > 0 ? (stats.approved / stats.appointments) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Pending Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-label">
                  <span className="text-secondary uppercase tracking-widest font-bold">
                    Pending Review
                  </span>
                  <span className="text-secondary font-mono">
                    {stats.appointments > 0
                      ? ((stats.pending / stats.appointments) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest/30">
                  <div
                    className="h-full bg-secondary transition-all duration-1000"
                    style={{
                      width: `${stats.appointments > 0 ? (stats.pending / stats.appointments) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Rejected Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-label">
                  <span className="text-error uppercase tracking-widest font-bold">
                    Rejected / Purged
                  </span>
                  <span className="text-error font-mono">
                    {stats.appointments > 0
                      ? ((stats.rejected / stats.appointments) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest/30">
                  <div
                    className="h-full bg-error transition-all duration-1000"
                    style={{
                      width: `${stats.appointments > 0 ? (stats.rejected / stats.appointments) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* System Health Note */}
              <div className="pt-4 border-t border-outline-variant/10 mt-6">
                <div className="flex items-center gap-3 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  <p className="text-[9px] font-label uppercase leading-tight tracking-tighter">
                    Monitor the 'Pending' index. A rate above 30% indicates
                    potential communication bottlenecks between faculty and
                    students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SYNC_OVERVIEW TABLE (Recent snippet) */}
          <div className="col-span-12 bg-surface-container-low p-6 border border-[#c7fffe]/5 relative overflow-hidden mt-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#c7fffe] uppercase tracking-widest">
                  Recent Activity Streams
                </h3>
                <p className="text-[10px] text-[#c7fffe]/40 tracking-widest font-label uppercase">
                  5 Most Recent Requests
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#c7fffe]/10">
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      REF ID
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      STUDENT & FACULTY
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline">
                      DATE & TIME
                    </th>
                    <th className="pb-4 px-4 text-[10px] font-bold text-[#c7fffe]/40 uppercase tracking-widest font-headline text-right">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7fffe]/5">
                  {loading && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase animate-pulse"
                      >
                        Loading Streams...
                      </td>
                    </tr>
                  )}
                  {!loading && appointments.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-[10px] text-[#c7fffe]/40 font-headline uppercase"
                      >
                        No Real-time Activity
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    appointments.map((app) => (
                      <tr
                        key={app._id}
                        className="group hover:bg-[#c7fffe]/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-[11px] font-mono text-[#c7fffe]">
                          #{app._id.substring(0, 8)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-[#c7fffe] uppercase tracking-tight">
                              {app.studentId?.name}
                            </span>
                            <span className="material-symbols-outlined text-[10px] text-[#c7fffe]/40 mx-2">
                              arrow_forward
                            </span>
                            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
                              Prof. {app.facultyId?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-[#c7fffe]/40 font-mono">
                          {app.slotId
                            ? format(
                                new Date(app.slotId.startTime),
                                "MMM dd, yyyy _ HH:mm",
                              )
                            : "UNK_TIME"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`text-[10px] flex items-center justify-end gap-2 font-bold tracking-widest ${
                              app.status === "APPROVED"
                                ? "text-[#c7fffe]"
                                : "text-secondary"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 ${app.status === "APPROVED" ? "bg-[#c7fffe]" : "bg-secondary animate-pulse"}`}
                            ></span>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* System Footer Metadata */}
      <footer className="mt-8 pt-8 border-t border-[#c7fffe]/5 flex justify-between items-center text-[8px] font-label tracking-widest text-[#c7fffe]/20 uppercase">
        <div>UNIMEET FACULTY APPOINTMENT SYSTEM // v1.0.0</div>
        <div className="flex gap-6">
          <span className="hidden md:inline">COORD: 34.22.09.11</span>
          <span>STATUS: SECURE</span>
          <span className="hidden md:inline">ENCRYPT: AES-256-GCM</span>
        </div>
      </footer>
      {/* Action Modals */}
      <NexusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Confirm Deletion"
        message="CRITICAL ACTION: Are you sure you want to permanently delete this user and all associated timeline data? This operation cannot be reversed."
        confirmText="DELETE"
        cancelText="CANCEL"
        type="danger"
      />
    </div>
  );
};

export default AdminDashboard;
