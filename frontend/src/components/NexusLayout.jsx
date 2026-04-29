import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const NexusLayout = ({ children }) => {
  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 pt-16 min-h-screen relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background:
                "linear-gradient(to bottom, transparent 50%, rgba(199, 255, 254, 0.03) 50%)",
              backgroundSize: "100% 4px",
            }}
          ></div>

          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10 w-full">
            {children}
          </div>

          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation (Stitch Native Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl flex justify-around items-center h-16 z-50 border-t border-outline-variant/10">
        {/* Simplified mobile nav - logic can be added later or moved to a component */}
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium">Faculty</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-[10px] font-medium">Alerts</span>
        </button>
      </nav>
    </div>
  );
};

export default NexusLayout;
