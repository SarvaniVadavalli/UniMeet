import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import {
  getMyAppointments,
  updateAppointmentAgenda,
} from "../services/appointmentService";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [newAgenda, setNewAgenda] = useState("");
  const location = useLocation();
  const isAppointmentsPage = location.pathname === "/appointments";

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEditClick = (app) => {
    setEditingId(app._id);
    setNewAgenda(app.agenda);
  };

  const handleUpdateAgenda = async (id) => {
    try {
      await updateAppointmentAgenda(id, newAgenda);
      toast.success("Agenda Updated");
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update agenda");
    }
  };

  const activeCount = appointments.filter(
    (a) => a.status === "APPROVED",
  ).length;
  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING",
  ).length;
  const pastCount = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "REJECTED",
  ).length;

  const filteredAppointments = appointments.filter((a) => {
    if (filterTab === "ALL") return true;
    return a.status === filterTab;
  });

  return (
    <div className="w-full">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div className="space-y-1">
          <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
            Unimeet System
          </p>
          <h1 className="text-5xl font-headline font-bold tracking-tight text-on-surface">
            {isAppointmentsPage ? "My Appointments" : "Student Dashboard"}
          </h1>
          <p className="text-on-surface-variant font-label tracking-widest uppercase">
            Welcome back, {user?.name}
          </p>
        </div>
        <Link
          to="/browse-faculty"
          className="chamfer-btn bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 font-headline font-bold uppercase tracking-widest flex items-center gap-3 hover:shadow-[0_0_20px_rgba(0,240,240,0.4)] transition-all group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:rotate-90">
            add
          </span>
          Book New Appointment
        </Link>
      </header>

      {/* Stats Bento Grid */}
      {!isAppointmentsPage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div
            onClick={() => setFilterTab("APPROVED")}
            className="surface-container-low bg-surface-container-low/70 backdrop-blur-xl p-8 chamfer-tr-bl border-l border-primary/20 relative group cursor-pointer hover:border-primary transition-all"
          >
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40 group-hover:border-primary transition-colors"></div>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  event
                </span>
                <span className="font-label text-[10px] text-primary/40 uppercase tracking-widest">
                  Active
                </span>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold text-on-surface">
                  {activeCount < 10 ? `0${activeCount}` : activeCount}
                </p>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  Active Appointments
                </p>
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div
            onClick={() => setFilterTab("PENDING")}
            className="surface-container-low bg-surface-container-low/70 backdrop-blur-xl p-8 chamfer-tr-bl border-l border-secondary/20 relative group cursor-pointer hover:border-secondary transition-all"
          >
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-secondary/40 group-hover:border-secondary transition-colors"></div>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary text-3xl">
                  pending_actions
                </span>
                <span className="font-label text-[10px] text-secondary/40 uppercase tracking-widest">
                  Queued
                </span>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold text-on-surface">
                  {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                </p>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  Pending Approvals
                </p>
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div
            onClick={() => setFilterTab("COMPLETED")}
            className="surface-container-low bg-surface-container-low/70 backdrop-blur-xl p-8 chamfer-tr-bl border-l border-primary/20 relative group cursor-pointer hover:border-primary transition-all"
          >
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40 group-hover:border-primary transition-colors"></div>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-3xl">
                  history
                </span>
                <span className="font-label text-[10px] text-primary/40 uppercase tracking-widest">
                  Completed
                </span>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold text-on-surface">
                  {pastCount < 10 ? `0${pastCount}` : pastCount}
                </p>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  Past Appointments
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sync Operations */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-xl font-bold tracking-widest uppercase">
                My Appointments
              </h2>
              <div className="h-px w-12 bg-gradient-to-r from-outline-variant/30 to-transparent hidden sm:block"></div>
            </div>
            <div className="flex bg-surface-container-high border border-outline-variant/10 p-1 flex-wrap gap-1">
              {["ALL", "PENDING", "APPROVED", "COMPLETED", "REJECTED"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-4 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors ${filterTab === tab ? "bg-primary text-on-primary" : "text-outline hover:text-on-surface"}`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>
          {loading && (
            <p className="text-outline-variant font-label text-xs uppercase animate-pulse">
              Loading Appointments...
            </p>
          )}

          {!loading && filteredAppointments.length === 0 && (
            <div className="bg-surface-container-high/20 p-6 border border-outline-variant/10 text-center">
              <p className="text-outline-variant font-label text-sm uppercase tracking-widest">
                No Appointments matching filters.
              </p>
            </div>
          )}

          {!loading &&
            filteredAppointments.map((app) => (
              <div
                key={app._id}
                className={`bg-surface-container-high/40 border-l-2 ${app.status === "APPROVED" ? "border-primary" : app.status === "PENDING" ? "border-secondary" : app.status === "COMPLETED" ? "border-outline-variant/30 opacity-80" : "border-error/30 opacity-60"} p-6 flex items-center justify-between group hover:bg-surface-container-high/60 transition-colors`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 h-12 bg-surface-container-highest flex flex-col items-center justify-center font-headline text-on-surface-variant/40 border border-outline-variant/10 shrink-0">
                    <span className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {app.slotId
                        ? format(new Date(app.slotId.startTime), "dd")
                        : "--"}
                    </span>
                    <span className="text-[8px] uppercase tracking-tighter">
                      {app.slotId
                        ? format(new Date(app.slotId.startTime), "MMM")
                        : "UNK"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === app._id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="bg-surface-container-highest border border-primary/30 p-1 text-sm text-on-surface outline-none flex-1 font-headline uppercase font-bold"
                          value={newAgenda}
                          onChange={(e) => setNewAgenda(e.target.value)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateAgenda(app._id)}
                          className="text-primary hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-outline hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            cancel
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors max-w-sm truncate uppercase">
                          {app.agenda}
                        </h3>
                        {app.status === "PENDING" && (
                          <button
                            onClick={() => handleEditClick(app)}
                            className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              edit
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-on-surface-variant/60 font-label uppercase tracking-widest mt-1">
                      Prof. {app.facultyId?.name} •{" "}
                      {app.slotId?.type || "Standard"} •{" "}
                      {app.slotId
                        ? format(new Date(app.slotId.startTime), "HH:mm")
                        : "UNK"}
                    </p>

                    {app.responseNote && (
                      <div className="mt-2 p-2 bg-primary/5 border-l border-primary/20 flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">
                          info
                        </span>
                        <p className="text-[10px] text-primary/80 font-label uppercase leading-tight">
                          Note: {app.responseNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`px-3 py-1 text-[10px] font-label font-bold uppercase tracking-widest border ${
                      app.status === "APPROVED"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : app.status === "COMPLETED"
                          ? "bg-surface-container-highest text-outline border-outline-variant/20"
                          : app.status === "PENDING"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : "bg-error/10 text-error border-error/20"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
        </section>

        {/* Sidebar Modules */}
        <aside className="space-y-8">
          {/* Visual Feed */}
          <div className="relative overflow-hidden group border border-outline-variant/30">
            <img
              alt="Campus Telemetry"
              className="w-full grayscale group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuButJIooODiun8Ifi1l6A0HCp3ErLZJojJLOlsoT6DrQtFw1ccej0x_E3gQyFWn7k32pUny3ZZpzkX2t2JQL1WyVjMItaIK0n-w5PTT3KhsnbTwZKxQu5eW6n8Pv5ucSwtlyDBySrxOtN04tFLAdWcImSH1IMbISamQhY51eVkG458pFkHTwEPGP00zB4TykLRjMWhMongGz2F48Wfco4JoNB79D4bXGNeGg264WtDEF4MDu3iDuFS_OgnSDrjq_u_OgsZwhdsOeo7G"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4">
              <p className="font-label text-[10px] text-primary uppercase tracking-[0.4em] font-bold">
                Unimeet Guidelines
              </p>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-1 h-1 bg-primary"></div>
              <div className="w-1 h-1 bg-primary"></div>
              <div className="w-1 h-1 bg-primary/20"></div>
            </div>
          </div>

          {/* Advisory Alert */}
          <div className="bg-error-container/20 p-6 border-l-2 border-error space-y-2">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="font-headline text-[10px] font-bold uppercase tracking-widest">
                Notice
              </span>
            </div>
            <p className="text-xs text-on-error-container/80 font-label leading-relaxed">
              Always ensure your profile details are up to date before
              requesting an appointment with faculty members.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;
