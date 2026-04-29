import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
import { globalSearch } from "../services/searchService";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let intervalId;
    if (user) {
      fetchNotifications();
      intervalId = setInterval(() => {
        fetchNotifications(true);
      }, 30000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const results = await globalSearch(searchQuery);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchNotifications = async (silent = true) => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (!silent) toast.error("Failed to fetch notifications");
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification read:", error);
      toast.error("Failed to mark read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
      toast.success("All alerts marked as seen");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Could not clear notifications");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "STUDENT_ROLE") return "/student-dashboard";
    if (user.role === "FACULTY_ROLE") return "/faculty-dashboard";
    if (user.role === "ADMIN_ROLE") return "/admin/dashboard";
    return "/";
  };

  const isInfoPage = location.pathname === "/protocols";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#0f1511]/80 backdrop-blur-xl bg-gradient-to-b from-[#1a221d] to-transparent shadow-[0_0_20px_rgba(0,240,240,0.15)]">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-widest text-[#c7fffe] uppercase font-['Space_Grotesk'] hover:text-primary transition-colors"
        >
          UNIMEET NEXUS
        </Link>
        {!isInfoPage && user && (
          <div className="hidden md:flex gap-6 items-center">
            <div className="relative" ref={searchRef}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 text-sm">
                search
              </span>
              <input
                className="bg-surface-container-highest border-none focus:ring-1 focus:ring-primary text-xs font-label pl-10 pr-4 py-2 w-64 outline-none text-on-surface transition-colors"
                placeholder="Search Faculty..."
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) setShowSearchDropdown(true);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) setShowSearchDropdown(true);
                }}
              />

              {showSearchDropdown && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-surface-container-high border border-outline-variant/20 shadow-2xl z-50 chamfer-tr-bl overflow-hidden h-auto max-h-96 custom-scrollbar">
                  <div className="p-3 border-b border-outline-variant/10 bg-surface flex justify-between items-center">
                    <h3 className="font-headline text-primary text-[10px] uppercase tracking-[0.2em] font-bold">
                      Search Results
                    </h3>
                    {isSearching && (
                      <span className="text-[10px] text-primary animate-pulse">
                        Searching...
                      </span>
                    )}
                  </div>

                  {!isSearching && searchResults.length === 0 && (
                    <div className="p-6 text-center text-outline-variant font-label text-[10px] uppercase tracking-widest">
                      No Results Found
                    </div>
                  )}

                  {!isSearching &&
                    searchResults.map((category, catIdx) => (
                      <div key={catIdx} className="mb-2">
                        <div className="bg-surface-container-highest/50 px-3 py-1 text-[8px] text-outline-variant font-headline uppercase tracking-widest border-y border-outline-variant/5">
                          {category.type} MATCHES
                        </div>
                        <div className="flex flex-col divide-y divide-outline-variant/5">
                          {category.results.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 hover:bg-primary/10 cursor-pointer transition-colors group flex justify-between items-center"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setSearchQuery("");
                                if (category.type === "faculty")
                                  navigate("/browse-faculty");
                              }}
                            >
                              <div>
                                <p className="text-xs font-headline font-bold text-on-surface uppercase group-hover:text-primary transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-outline font-body mt-0.5">
                                  {item.department || "General Actions"}
                                </p>
                              </div>
                              <span className="material-symbols-outlined text-outline-variant text-[14px] group-hover:text-primary">
                                arrow_forward
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && !isInfoPage && (
          <>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) fetchNotifications(false);
                }}
                className={`p-2 transition-all duration-300 relative ${showNotifications ? "text-primary bg-primary/10" : "text-[#c7fffe]/50 hover:text-[#c7fffe] hover:bg-[#c7fffe]/10"}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-high border border-outline-variant/20 shadow-2xl z-50 chamfer-tr-bl overflow-hidden">
                  <div className="p-4 border-b border-outline-variant/10 bg-surface flex justify-between items-center">
                    <h3 className="font-headline text-primary text-xs uppercase tracking-[0.2em] font-bold">
                      Notifications
                    </h3>
                    <span className="text-[10px] text-on-surface-variant">
                      {notifications.filter((n) => !n.read).length} Unread
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-outline-variant font-label text-[10px] uppercase tracking-widest">
                        No New Notifications
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y divide-outline-variant/5">
                        {notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              if (!notif.read)
                                handleReadNotification(notif._id);
                            }}
                            className={`p-4 hover:bg-surface-container-highest cursor-pointer transition-colors ${!notif.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span
                                className={`text-[10px] uppercase font-bold tracking-widest ${notif.type === "SUCCESS" ? "text-primary" : notif.type === "ERROR" || notif.type === "WARNING" ? "text-error" : "text-secondary"}`}
                              >
                                {notif.type}
                              </span>
                              <span className="text-[10px] text-outline">
                                {formatDistanceToNow(
                                  new Date(notif.createdAt),
                                  { addSuffix: true },
                                )}
                              </span>
                            </div>
                            <p
                              className={`text-sm font-body ${!notif.read ? "text-on-surface" : "text-on-surface-variant"}`}
                            >
                              {notif.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-surface border-t border-outline-variant/10 flex justify-between items-center">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] uppercase font-bold text-primary hover:underline"
                    >
                      View All
                    </Link>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] uppercase font-bold text-outline-variant hover:text-on-surface transition-colors"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="w-10 h-10 bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer group relative"
            >
              <img
                alt="Profile"
                src={
                  user.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/201/201818.png"
                }
                className="w-full h-full object-cover p-1"
              />
            </Link>
          </div>
        )}
        {!user && (
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-xs font-label uppercase tracking-widest transition-all ${location.pathname === "/" ? "text-primary font-bold shadow-[0_0_10px_rgba(0,240,240,0.3)]" : "text-[#c7fffe]/60 hover:text-[#c7fffe]"}`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`text-xs font-label uppercase tracking-widest transition-all ${location.pathname === "/login" ? "text-primary font-bold shadow-[0_0_10px_rgba(0,240,240,0.3)]" : "text-[#c7fffe]/60 hover:text-[#c7fffe]"}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`text-xs font-label uppercase tracking-widest transition-all px-3 py-1 border border-primary/20 hover:bg-primary/10 ${location.pathname === "/register" ? "text-primary border-primary bg-primary/5 font-bold shadow-[0_0_10px_rgba(0,240,240,0.3)]" : "text-primary"}`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
