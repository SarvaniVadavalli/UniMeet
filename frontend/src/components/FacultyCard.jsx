import React from "react";

const FacultyCard = ({ faculty, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(faculty._id)}
      className={`p-4 cursor-pointer border-l-4 transition-all duration-300 ${
        isSelected
          ? "bg-surface-container-high border-primary shadow-[0_0_15px_rgba(0,240,240,0.1)]"
          : "bg-surface-container border-transparent hover:border-primary/50"
      }`}
    >
      <h3 className="font-headline font-bold text-lg text-[#c7fffe] uppercase">
        {faculty.name}
      </h3>
      <p className="text-xs text-[#c7fffe]/60 font-body">
        {faculty.profile?.title || "Instructor"} •{" "}
        {faculty.profile?.department || "General"}
      </p>
      <div className="mt-2 flex gap-2 flex-wrap">
        {faculty.profile?.expertise?.map((exp, idx) => (
          <span
            key={idx}
            className="text-[9px] px-2 py-0.5 bg-surface-container-highest text-secondary uppercase font-label"
          >
            {exp}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FacultyCard;
