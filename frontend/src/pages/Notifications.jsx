import React, { useState, useEffect } from "react";

import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
import toast from "react-hot-toast";
import NotificationCard from "../components/NotificationCard";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Error updating notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Error updating notifications");
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8 border-b border-outline-variant/20 pb-6 flex justify-between items-end">
        <div>
          <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
            Transmission Hub
          </p>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface uppercase mt-2">
            Notifications
          </h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-label uppercase tracking-widest text-primary hover:text-white border border-primary/20 px-4 py-2 hover:bg-primary/10 transition-all"
          >
            Mark All as Read
          </button>
        )}
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center animate-pulse uppercase font-label tracking-widest text-outline-variant">
            Scanning for new alerts...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-outline-variant/20 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-outline-variant/30 mb-4">
              notifications_off
            </span>
            <p className="font-label text-xs uppercase tracking-widest text-outline-variant">
              No notifications in the logs
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationCard
              key={notif._id}
              notification={notif}
              onRead={handleRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
