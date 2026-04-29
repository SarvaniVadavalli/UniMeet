import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMySlots } from "../services/slotService";
import { getMyAppointments } from "../services/appointmentService";
import { getFacultyById, updateMyProfile } from "../services/facultyService";
import toast from "react-hot-toast";

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    bio: "",
    department: "",
    title: "",
    expertise: "",
  });

  const fetchData = async () => {
    try {
      const [fetchedSlots, fetchedApps, fetchedProf] = await Promise.all([
        getMySlots(),
        getMyAppointments(),
        getFacultyById(user._id),
      ]);
      setSlots(fetchedSlots);
      setAppointments(fetchedApps);
      setProfile(fetchedProf.profile);
      setEditForm({
        bio: fetchedProf.profile.bio || "",
        department: fetchedProf.profile.department || "",
        title: fetchedProf.profile.title || "",
        expertise: fetchedProf.profile.expertise
          ? fetchedProf.profile.expertise.join(",")
          : "",
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchData();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const expArray = editForm.expertise.split(",").map((item) => item.trim());
      await updateMyProfile({
        bio: editForm.bio,
        department: editForm.department,
        title: editForm.title,
        expertise: expArray,
      });
      toast.success("Profile Biography Updated");
      setEditMode(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Update Failed");
    }
  };

  const upcomingAppointments = appointments
    .filter((a) => a.status === "APPROVED" && a.slotId)
    .sort((a, b) => new Date(a.slotId.startTime) - new Date(b.slotId.startTime))
    .slice(0, 3);

  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING",
  ).length;
  const bookedCount = slots.filter((s) => s.status === "BOOKED").length;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="relative mb-12">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-primary animate-pulse"></div>
        <p className="font-label uppercase tracking-[0.3em] text-primary text-[10px] mb-2">
          UniMeet Platform // Faculty Profile
        </p>
        <h1 className="text-5xl font-headline font-bold tracking-tighter text-on-surface uppercase mb-4">
          Welcome, Dr. {user?.name}
        </h1>
        <div className="flex gap-4">
          <span className="bg-surface-container px-3 py-1 text-[10px] font-label tracking-widest text-secondary border border-secondary/20 uppercase">
            {profile?.department || "Sector_Unassigned"}
          </span>
          <span className="bg-surface-container px-3 py-1 text-[10px] font-label tracking-widest text-on-surface-variant border border-outline-variant/30 uppercase">
            {profile?.title || "Faculty Member"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Statistics Bento Grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 border-l-2 border-primary relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-primary/5 text-6xl material-symbols-outlined transition-transform group-hover:scale-110">
              event_available
            </div>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-1">
              Active Slots
            </p>
            <p className="text-4xl font-headline font-bold text-primary">
              {loading ? "--" : slots.length}
            </p>
            <p className="text-[9px] text-outline-variant mt-2 uppercase font-mono">
              Current Availability Cycle
            </p>
          </div>
          <div className="bg-surface-container-low p-6 border-l-2 border-secondary relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-secondary/5 text-6xl material-symbols-outlined transition-transform group-hover:scale-110">
              assignment_ind
            </div>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-1">
              Booked Sessions
            </p>
            <p className="text-4xl font-headline font-bold text-secondary">
              {loading ? "--" : bookedCount}
            </p>
            <p className="text-[9px] text-outline-variant mt-2 uppercase font-mono">
              Confirmed Mentorship Hubs
            </p>
          </div>
          <div className="bg-surface-container-low p-6 border-l-2 border-error relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-error/5 text-6xl material-symbols-outlined transition-transform group-hover:scale-110">
              pending_actions
            </div>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-1">
              Pending Requests
            </p>
            <p className="text-4xl font-headline font-bold text-error">
              {loading ? "--" : pendingCount}
            </p>
            <p className="text-[9px] text-outline-variant mt-2 uppercase font-mono">
              Action Required in Queue
            </p>
          </div>
          <div className="bg-surface-container-low p-6 border-l-2 border-on-surface-variant relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-on-surface-variant/5 text-6xl material-symbols-outlined transition-transform group-hover:scale-110">
              history_edu
            </div>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-1">
              Total Mentorships
            </p>
            <p className="text-4xl font-headline font-bold text-on-surface">
              {loading ? "--" : completedCount}
            </p>
            <p className="text-[9px] text-outline-variant mt-2 uppercase font-mono">
              Sessions Successfully Logged
            </p>
          </div>

          {/* Upcoming Timeline */}
          <div className="col-span-full bg-surface-container-high/40 p-8 border border-outline-variant/10 mt-4 chamfer-tr">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-on-surface">
                Upcoming Timelines
              </h3>
              <Link to="/appointment-requests" className="text-[9px] font-label uppercase tracking-widest text-primary hover:underline">
                View All Schedule
              </Link>
            </div>
            <div className="space-y-4">
              {loading && (
                <p className="text-xs font-label uppercase animate-pulse">
                  Syncing chronological data...
                </p>
              )}
              {!loading && upcomingAppointments.length === 0 && (
                <p className="text-xs font-label text-outline uppercase">
                  No confirmed sessions in the near future
                </p>
              )}
              {!loading &&
                upcomingAppointments.map((app, i) => (
                  <div
                    key={app._id}
                    className="flex items-center gap-6 p-4 bg-surface-container-low border-r-2 border-primary/20 group hover:border-primary transition-all"
                  >
                    <div className="flex flex-col items-center justify-center p-2 bg-primary/10 w-16 h-16 chamfer-tr-bl">
                      <span className="text-[10px] font-label text-primary uppercase">
                        {format(new Date(app.slotId.startTime), "MMM")}
                      </span>
                      <span className="text-xl font-headline font-bold text-primary">
                        {format(new Date(app.slotId.startTime), "dd")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface uppercase group-hover:text-primary transition-colors">
                        {app.agenda}
                      </p>
                      <p className="text-[10px] text-outline-variant font-label uppercase">
                        Student: {app.studentId?.name} • Room_{i + 104}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-headline font-bold text-on-surface">
                        {format(new Date(app.slotId.startTime), "HH:mm")}
                      </p>
                      <p className="text-[9px] text-outline font-mono">
                        60 MIN SESSION
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Profile Summary Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container p-6 relative group border-t-2 border-primary">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-headline text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Identity Matrix
              </h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-[10px] text-outline hover:text-primary transition-colors uppercase font-bold"
              >
                [ {editMode ? "CANCEL" : "MODIFY"} ]
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <input
                  className="w-full bg-surface-container-high p-3 text-xs border border-outline-variant/20 focus:border-primary outline-none"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full bg-surface-container-high p-3 text-xs border border-outline-variant/20 focus:border-primary outline-none h-32"
                  placeholder="Mission Bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                />
                <input
                  className="w-full bg-surface-container-high p-3 text-xs border border-outline-variant/20 focus:border-primary outline-none"
                  placeholder="Expertise (Tags)"
                  value={editForm.expertise}
                  onChange={(e) =>
                    setEditForm({ ...editForm, expertise: e.target.value })
                  }
                />
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-primary text-on-primary py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all"
                >
                  UPDATE_MATRIX
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="aspect-video relative overflow-hidden mb-4 rounded-sm">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                      alt="Profile"
                      className="w-full h-full object-cover filter grayscale opacity-50 contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed font-body uppercase italic opacity-70">
                    "
                    {profile?.bio ||
                      "Initialize your faculty identity matrix to bridge communication nodes."}
                    "
                  </p>
                </div>
                <div className="space-y-4 border-t border-outline-variant/10 pt-4">
                  <div>
                    <p className="text-[9px] font-label text-outline uppercase tracking-widest mb-2">
                      Core_Expertise
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile?.expertise?.map((exp, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-surface-container-highest text-[8px] font-label text-secondary uppercase border border-secondary/10"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-surface-container-highest p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <span className="material-symbols-outlined text-6xl">
                verified_user
              </span>
            </div>
            <h4 className="text-[10px] font-label text-primary uppercase tracking-widest mb-3">
              Verification_Seal
            </h4>
            <p className="text-[9px] text-outline-variant font-body leading-relaxed">
              Identity authorized via UniMeet Security Protocols. Profile
              status: ACTIVE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
