import React from "react";
import { format } from "date-fns";

const AppointmentCard = ({
  appointment,
  onUpdateStatus,
  showActions,
  responseNote,
  onNoteChange,
}) => {
  const isPending = appointment.status === "PENDING";
  const isApproved = appointment.status === "APPROVED";

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-4 hover:bg-on-surface/[0.02] transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-surface uppercase">
            {appointment.studentId?.name || "Unknown Entity"}
          </span>
          <span className="text-[10px] text-outline-variant font-mono tracking-tight">
            {appointment.studentId?.email}
          </span>
        </div>
        <span
          className={`text-[9px] font-label uppercase px-2 py-0.5 border ${
            appointment.status === "APPROVED"
              ? "border-primary/20 text-primary bg-primary/5"
              : appointment.status === "COMPLETED"
                ? "border-outline/20 text-outline-variant bg-surface-container-highest"
                : appointment.status === "PENDING"
                  ? "border-secondary/20 text-secondary bg-secondary/5"
                  : "border-error/20 text-error bg-error/5"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-on-surface-variant font-body">
          {appointment.agenda || "N/A"}
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-outline">
            calendar_today
          </span>
          <span className="text-xs text-on-surface font-body">
            {appointment.slotId
              ? format(
                  new Date(appointment.slotId.startTime),
                  "MMM dd, yyyy @ HH:mm",
                )
              : "N/A"}
          </span>
        </div>
      </div>

      {showActions && (
        <div className="pt-4 border-t border-outline-variant/5">
          {isPending ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Add instruction/note..."
                value={responseNote || ""}
                onChange={(e) => onNoteChange(appointment._id, e.target.value)}
                className="w-full bg-surface-container-high p-2 text-xs text-on-surface border border-outline-variant/20 outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onUpdateStatus(appointment._id, "APPROVED")}
                  className="flex-1 py-2 bg-primary/20 text-primary text-[10px] font-bold uppercase hover:bg-primary hover:text-on-primary transition-all border border-primary/20"
                >
                  Approve
                </button>
                <button
                  onClick={() => onUpdateStatus(appointment._id, "REJECTED")}
                  className="flex-1 py-2 bg-error/20 text-error text-[10px] font-bold uppercase hover:bg-error hover:text-on-error transition-all border border-error/20"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : isApproved ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Closing note..."
                value={responseNote || ""}
                onChange={(e) => onNoteChange(appointment._id, e.target.value)}
                className="w-full bg-surface-container-high p-2 text-xs text-on-surface border border-outline-variant/20 outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => onUpdateStatus(appointment._id, "COMPLETED")}
                className="w-full py-2 border border-outline-variant/30 text-outline-variant text-[10px] font-bold uppercase hover:bg-surface-container-highest transition-all"
              >
                Complete Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-outline font-label uppercase italic">
                History Logged
              </span>
              {appointment.responseNote && (
                <span className="text-[8px] text-outline-variant mt-1 italic">
                  Note: {appointment.responseNote}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
