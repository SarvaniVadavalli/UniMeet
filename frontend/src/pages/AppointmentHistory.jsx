import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import {
  getMyAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService";
import toast from "react-hot-toast";
import AppointmentCard from "../components/AppointmentCard";

const FacultyAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [responseNotes, setResponseNotes] = useState({});

  const fetchAppointments = async () => {
    try {
      const fetched = await getMyAppointments();
      setAppointments(fetched);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchAppointments();
    }
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const note = responseNotes[id] || "";
      await updateAppointmentStatus(id, status, note);
      toast.success(`Request ${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Error updating status";
      toast.error(message);
    }
  };

  const filteredApps = appointments.filter(
    (a) => filter === "ALL" || a.status === filter,
  );

  return (
    <div className="w-full">
      <div className="relative mb-8 flex justify-between items-end">
        <div>
          <div className="absolute -left-4 top-0 w-1 h-8 bg-secondary"></div>
          <h1 className="text-3xl font-headline font-bold tracking-tighter text-on-surface uppercase">
            Appointment Requests
          </h1>
          <p className="text-xs font-label text-outline uppercase tracking-[0.2em] mt-1">
            Review and validate incoming student session packets
          </p>
        </div>

        <div className="flex bg-surface-container border border-outline-variant/10 p-1">
          {["PENDING", "APPROVED", "COMPLETED", "REJECTED", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-label uppercase tracking-widest transition-all ${filter === f ? "bg-secondary text-on-secondary" : "text-outline hover:text-on-surface"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full py-20 text-center text-xs font-label uppercase animate-pulse">
            Scanning Timelines...
          </div>
        )}
        {!loading && filteredApps.length === 0 && (
          <div className="col-span-full py-20 text-center text-xs font-label text-outline uppercase border border-dashed border-outline-variant/20">
            No requests data found in sector
          </div>
        )}
        {!loading &&
          filteredApps.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              showActions={true}
              onUpdateStatus={handleUpdateStatus}
              responseNote={responseNotes[app._id]}
              onNoteChange={(id, note) =>
                setResponseNotes({ ...responseNotes, [id]: note })
              }
            />
          ))}
      </div>
    </div>
  );
};

export default FacultyAppointments;
