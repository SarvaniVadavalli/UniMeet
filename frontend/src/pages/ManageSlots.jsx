import React, { useContext, useEffect, useState } from "react";
// Force Refresh: 2026-04-27 18:05
import { format, addHours } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { getMySlots, createSlot, deleteSlot } from "../services/slotService";
import toast from "react-hot-toast";
import NexusModal from "../components/NexusModal";

const ManageSlots = () => {
  const { user } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  // Slot Creation Form State
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");
  const [newSlotType, setNewSlotType] = useState("General Query");

  const fetchSlots = async () => {
    try {
      const fetchedSlots = await getMySlots();
      setSlots(fetchedSlots);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchSlots();
    }
  }, [user]);

  const handleCreateSlot = async () => {
    if (!newSlotDate || !newSlotTime) {
      toast.error("Please select BOTH a date and time.");
      return;
    }

    try {
      const startDateTime = new Date(`${newSlotDate}T${newSlotTime}`);

      if (isNaN(startDateTime.getTime())) {
        toast.error("Invalid Date or Time selected.");
        return;
      }

      await createSlot({
        startTime: startDateTime,
        endTime: addHours(startDateTime, 1),
        type: newSlotType,
      });

      setNewSlotDate("");
      setNewSlotTime("");
      toast.success("Appointment Slot Created");
      fetchSlots();
    } catch (error) {
      console.error("Slot Creation Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Slot Creation Failed";
      toast.error(message);
    }
  };

  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;

    setIsModalOpen(false);
    try {
      await deleteSlot(slotToDelete);
      toast.success("Slot Deleted");
      fetchSlots();
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete Slot");
    } finally {
      setSlotToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mb-8">
        <div className="absolute -left-4 top-0 w-1 h-8 bg-primary"></div>
        <h1 className="text-3xl font-headline font-bold tracking-tighter text-on-surface uppercase">
          Manage Availability
        </h1>
        <p className="text-xs font-label text-outline uppercase tracking-[0.2em] mt-1">
          Configure your open windows for student mentorship
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Slot Management Main Panel */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-surface-container-low p-8 border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>

            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-xl font-bold tracking-tight uppercase text-on-surface">
                  Scheduling Matrix
                </h2>
                <p className="text-[10px] font-label text-outline-variant uppercase tracking-widest mt-1">
                  Active appointment windows for current semester
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 bg-primary"></span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase">
                  Academic Year 2026/27
                </span>
              </div>
            </div>

            {/* Scheduling Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {loading && (
                <p className="col-span-full py-12 text-center text-xs font-label uppercase animate-pulse">
                  Scanning Grid...
                </p>
              )}
              {!loading && slots.length === 0 && (
                <p className="col-span-full py-12 text-center text-xs font-label text-outline uppercase">
                  No Active Slots Configured
                </p>
              )}
              {!loading &&
                slots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`group relative bg-surface-container p-4 border-l-4 transition-all duration-300 ${slot.status === "BOOKED" ? "border-primary opacity-50 bg-primary/5" : "border-outline-variant/20 hover:border-primary/50"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-label font-bold tracking-widest text-primary uppercase bg-primary/10 px-2 py-0.5 chamfer-tr">
                        {slot.type || "SESSION_NODE"}
                      </span>
                      {slot.status === "BOOKED" ? (
                        <span className="material-symbols-outlined text-primary text-xs">
                          lock
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSlotToDelete(slot._id);
                            setIsModalOpen(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-error text-xs hover:scale-110">
                            delete
                          </span>
                        </button>
                      )}
                    </div>
                    <p className="font-headline text-lg font-bold text-on-surface leading-tight mt-2">
                      {format(new Date(slot.startTime), "HH:mm")}
                    </p>
                    <p className="text-[9px] text-outline uppercase font-mono tracking-tighter">
                      {format(new Date(slot.startTime), "MMM dd, yyyy")}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-outline-variant/5">
                      <span
                        className={`text-[8px] font-label uppercase px-1.5 py-0.5 ${slot.status === "BOOKED" ? "text-primary" : "text-outline-variant"}`}
                      >
                        {slot.status}
                      </span>
                      <span className="text-[8px] font-mono text-outline-variant uppercase">
                        REF_{slot._id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Creation Form Section */}
            <div className="border-t border-outline-variant/10 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">
                  add_circle
                </span>
                <h3 className="text-xs font-headline font-bold text-primary uppercase tracking-widest">
                  Register New Availability Window
                </h3>
              </div>

              <div className="flex flex-col md:flex-row items-end gap-6 bg-surface-container-high/30 p-6 border border-outline-variant/10 chamfer-tr">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-label text-outline-variant uppercase tracking-widest">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    className="w-full bg-surface-container p-3 text-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-label text-outline-variant uppercase tracking-widest">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="w-full bg-surface-container p-3 text-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-label text-outline-variant uppercase tracking-widest">
                    Session Logic
                  </label>
                  <select
                    value={newSlotType}
                    onChange={(e) => setNewSlotType(e.target.value)}
                    className="w-full bg-surface-container p-3 text-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:border-primary transition-colors uppercase"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Project Discussion">
                      Project Discussion
                    </option>
                    <option value="Doubt Clearing">Doubt Clearing</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Career Guidance">Career Guidance</option>
                  </select>
                </div>
                <div className="flex-none">
                  <button
                    onClick={handleCreateSlot}
                    className="h-[46px] px-8 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all chamfer-btn border-0"
                  >
                    + CREATE_SLOT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-container p-6 border-l-2 border-primary">
            <h4 className="text-[10px] font-label text-outline uppercase tracking-widest mb-4">
              Availability Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant font-body">
                  Active Slots
                </span>
                <span className="text-lg font-headline font-bold text-primary">
                  {slots.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant font-body">
                  Booked Ratio
                </span>
                <span className="text-lg font-headline font-bold text-secondary">
                  {slots.length > 0
                    ? Math.round(
                        (slots.filter((s) => s.status === "BOOKED").length /
                          slots.length) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high/40 p-6 border border-outline-variant/10">
            <h4 className="text-[10px] font-label text-outline uppercase tracking-widest mb-4">
              Node Status
            </h4>
            <div className="flex items-center gap-3 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-headline font-bold uppercase">
                Uptime Optimal
              </span>
            </div>
            <p className="text-[9px] text-outline-variant mt-2 leading-relaxed font-body">
              All scheduling systems are operational. Synchronized with global
              UniMeet Platform.
            </p>
          </div>
        </div>
      </div>
      {/* Action Modals */}
      <NexusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSlotToDelete(null);
        }}
        onConfirm={handleDeleteSlot}
        title="Delete Slot"
        message="Are you sure you want to permanently delete this availability window? Students will no longer be able to book this time."
        confirmText="DELETE"
        cancelText="CANCEL"
        type="danger"
      />
    </div>
  );
};

export default ManageSlots;
