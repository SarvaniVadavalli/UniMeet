import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getFaculties, getFacultyById } from "../services/facultyService";
import { createAppointment } from "../services/appointmentService";
import FacultyCard from "../components/FacultyCard";

const FacultyDiscovery = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [agenda, setAgenda] = useState("");
  const [actionMessage, setActionMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await getFaculties();
        setFaculties(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching faculty", error);
        setLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  const handleSelectFaculty = async (id) => {
    setBookingSlot(null);
    setActionMessage(null);
    try {
      const data = await getFacultyById(id);
      setSelectedFaculty(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = async () => {
    if (!bookingSlot) return;
    try {
      await createAppointment({
        slotId: bookingSlot._id,
        facultyId: selectedFaculty._id,
        agenda,
      });
      setActionMessage({
        type: "success",
        text: "Appointment request submitted successfully!",
      });
      setBookingSlot(null);
      setAgenda("");
      // Refresh slots
      handleSelectFaculty(selectedFaculty._id);
    } catch (error) {
      setActionMessage({
        type: "error",
        text: error.response?.data?.message || "Error executing booking",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-primary animate-pulse py-20 text-center font-headline uppercase tracking-widest text-2xl">
        Loading Faculty Data...
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-8 border-b border-outline-variant/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
            Unimeet Directory
          </p>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface uppercase mt-2">
            Browse Faculty
          </h1>
          <p className="text-on-surface-variant font-label tracking-widest uppercase text-xs mt-2">
            Select a faculty member to view available slots and book an
            appointment
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search Faculty/Dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high/50 border border-outline-variant/20 p-2 pl-9 text-xs text-on-surface uppercase font-label tracking-widest focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="relative max-w-[180px] w-full">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-surface-container-high/50 border border-outline-variant/20 p-2 text-xs text-on-surface uppercase font-label tracking-widest focus:outline-none focus:border-primary transition-colors"
              title="Filter by availability date"
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-[10px] text-primary hover:text-white uppercase font-label tracking-widest"
            >
              Clear Date
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Master List */}
        <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          {faculties
            .filter((f) => {
              const nameMatch =
                f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.profile?.department
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase());

              if (!dateFilter) return nameMatch;

              // If date filter is applied, only show faculty with slots on that date
              const hasSlotsOnDate = f.slots?.some((slot) => {
                const slotDate = format(new Date(slot.startTime), "yyyy-MM-dd");
                return slotDate === dateFilter && slot.status === "OPEN";
              });

              return nameMatch && hasSlotsOnDate;
            })
            .map((fac) => (
              <FacultyCard
                key={fac._id}
                faculty={fac}
                isSelected={selectedFaculty?._id === fac._id}
                onClick={handleSelectFaculty}
              />
            ))}
          {faculties.filter(
            (f) =>
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.profile?.department
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
          ).length === 0 && (
            <p className="text-outline-variant text-sm font-label uppercase">
              No matches found.
            </p>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedFaculty ? (
            <div className="bg-surface-container-low p-8 border border-outline-variant/10 relative overflow-hidden chamfer-tr-bl min-h-[500px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>

              <h2 className="text-3xl font-headline font-bold text-[#c7fffe] uppercase mb-1">
                {selectedFaculty.name}
              </h2>
              <p className="text-sm text-outline-variant uppercase font-label tracking-widest">
                {selectedFaculty.profile?.bio}
              </p>

              <div className="mt-8 border-t border-outline-variant/20 pt-8">
                <h3 className="font-headline text-lg text-primary uppercase mb-4 tracking-widest">
                  Available Appointment Slots
                </h3>

                {actionMessage && (
                  <div
                    className={`p-4 mb-6 chamfer-both font-label text-xs uppercase tracking-widest ${actionMessage.type === "success" ? "bg-primary/20 text-primary border border-primary/50" : "bg-error/20 text-error border border-error/50"}`}
                  >
                    {actionMessage.text}
                  </div>
                )}

                {selectedFaculty.slots?.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFaculty.slots.map((slot) => {
                      const isPast = new Date(slot.startTime) < new Date();
                      const isBooked = slot.status === "BOOKED";
                      const isAvailable = !isPast && !isBooked;

                      return (
                        <button
                          key={slot._id}
                          disabled={!isAvailable}
                          onClick={() => setBookingSlot(slot)}
                          className={`p-4 text-left border-l-4 transition-all relative ${
                            !isAvailable
                              ? "bg-surface-container-low opacity-40 grayscale cursor-not-allowed border-outline-variant/30"
                              : bookingSlot?._id === slot._id
                                ? "bg-primary/10 border-primary"
                                : "bg-surface-container border-transparent hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-headline font-bold text-on-surface text-lg">
                              {format(new Date(slot.startTime), "HH:mm")}
                            </p>
                            {isBooked && (
                              <span className="material-symbols-outlined text-[10px] text-primary">
                                lock
                              </span>
                            )}
                            {isPast && !isBooked && (
                              <span className="text-[8px] font-label text-outline uppercase border border-outline/20 px-1">
                                Past
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-label text-outline uppercase">
                            {format(new Date(slot.startTime), "MMM dd, yyyy")}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[9px] font-label text-secondary tracking-widest uppercase">
                              {slot.type}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1 py-0.5 ${isBooked ? "bg-primary/20 text-primary" : "bg-outline-variant/10 text-outline-variant"}`}
                            >
                              {isBooked
                                ? "BOOKED"
                                : isPast
                                  ? "EXPIRED"
                                  : "OPEN"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-outline-variant font-label uppercase">
                    No Slots Currently Available
                  </p>
                )}
              </div>

              {/* Booking Action Area */}
              {bookingSlot && (
                <div className="mt-8 p-6 bg-surface-container-highest/50 border border-primary/20">
                  <h4 className="font-headline text-sm font-bold text-primary uppercase mb-4 tracking-widest">
                    Book Appointment
                  </h4>
                  <input
                    type="text"
                    placeholder="Reason for meeting (E.g. Project Review)"
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    className="w-full bg-surface-container p-3 mb-4 text-sm font-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-transparent"
                  />
                  <button
                    onClick={handleBook}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,240,0.3)] transition-all chamfer-btn"
                  >
                    Confirm Appointment @{" "}
                    {format(new Date(bookingSlot.startTime), "HH:mm")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] border border-outline-variant/10 border-dashed flex flex-col gap-4 items-center justify-center p-8 text-center text-outline-variant">
              <span className="material-symbols-outlined text-4xl opacity-50">
                touch_app
              </span>
              <p className="font-label text-xs uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                Select a faculty member to view available slots and book an
                appointment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDiscovery;
