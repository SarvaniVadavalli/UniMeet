import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#c7fffe]/10 py-12 bg-[#0f1511]">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-full mx-auto">
        <div className="text-lg font-black text-[#c7fffe] font-headline tracking-tighter">
          UNIMEET NEXUS
        </div>
        <div className="text-[#c7fffe] font-['Inter'] text-[10px] tracking-[0.2em] uppercase opacity-60">
          © 2024 UNIMEET NEXUS | CORE DIRECTIVE
        </div>
      </div>
    </footer>
  );
};

export default Footer;
