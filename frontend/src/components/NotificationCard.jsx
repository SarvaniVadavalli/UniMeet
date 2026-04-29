import React from "react";
import { formatDistanceToNow } from "date-fns";

const NotificationCard = ({ notification, onRead }) => {
  return (
    <div
      className={`p-6 border-l-4 transition-all duration-300 ${
        !notification.read
          ? "bg-surface-container border-primary shadow-[0_0_15px_rgba(0,240,240,0.05)]"
          : "bg-surface-container-low border-transparent opacity-70"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 ${
              notification.type === "SUCCESS"
                ? "bg-primary/20 text-primary"
                : notification.type === "ERROR" ||
                    notification.type === "WARNING"
                  ? "bg-error/20 text-error"
                  : "bg-secondary/20 text-secondary"
            }`}
          >
            {notification.type}
          </span>
          <span className="text-[10px] font-label text-outline uppercase">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {!notification.read && (
          <button
            onClick={() => onRead(notification._id)}
            className="text-[10px] font-label text-primary hover:underline uppercase"
          >
            Mark as seen
          </button>
        )}
      </div>
      <p
        className={`text-sm font-body ${!notification.read ? "text-on-surface" : "text-on-surface-variant"}`}
      >
        {notification.message}
      </p>
    </div>
  );
};

export default NotificationCard;
