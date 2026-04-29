import React from "react";

const Protocols = () => {
  const steps = [
    {
      id: "Step_01",
      title: "Browse Faculty",
      description:
        "Search and explore our diverse faculty members by department or area of expertise. Find the right person for your academic needs.",
      icon: "person_search",
      accent: "primary",
    },
    {
      id: "Step_02",
      title: "Book Appointment",
      description:
        "Select an available time slot from the faculty calendar. Provide a clear reason for your meeting to help the faculty prepare.",
      icon: "calendar_add_on",
      accent: "secondary",
    },
    {
      id: "Step_03",
      title: "Faculty Approval",
      description:
        "Once submitted, the faculty member will review your request. You will receive an status update if your session is approved or rejected.",
      icon: "fact_check",
      accent: "primary",
    },
    {
      id: "Step_04",
      title: "Get Notified",
      description:
        "Receive instant notifications for your appointment status and helpful reminders so you never miss a scheduled meeting.",
      icon: "notifications_active",
      accent: "secondary",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-8">
      <div className="relative mb-16 text-center">
        <p className="font-label uppercase tracking-[0.4em] text-primary text-[10px] mb-4">
          Steps to get started
        </p>
        <h1 className="text-5xl font-headline font-bold tracking-tighter text-[#c7fffe] uppercase mb-4 text-glow">
          How It Works
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto opacity-50 shadow-[0_0_10px_rgba(0,240,240,0.5)]"></div>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="group relative bg-[#1a221d] border border-[#c7fffe]/5 p-8 chamfer-tr hover:border-[#c7fffe]/20 transition-all duration-500 overflow-hidden shadow-lg"
          >
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] scale-150 transition-transform group-hover:scale-125 group-hover:opacity-[0.08]">
              <span className="material-symbols-outlined text-[160px] text-white">
                {step.icon}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="flex-none flex items-center justify-center w-24 h-24 bg-[#c7fffe]/5 border border-[#c7fffe]/10 chamfer-tr-bl relative">
                <span
                  className={`material-symbols-outlined text-4xl text-${step.accent}`}
                >
                  {step.icon}
                </span>
                <div className="absolute -top-3 -left-3 text-[10px] font-mono text-[#c7fffe]/40">
                  {step.id}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3
                  className={`text-2xl font-headline font-bold uppercase tracking-tight text-${step.accent} mb-3`}
                >
                  {index + 1}. {step.title}
                </h3>
                <p className="text-[#c7fffe]/60 text-base leading-relaxed max-w-2xl font-body">
                  {step.description}
                </p>
              </div>

              <div className="hidden lg:block w-32 text-right">
                <span className="text-[10px] font-label text-[#c7fffe]/10 uppercase tracking-[0.3em]">
                  Ready
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-[#c7fffe]/5 border-l-4 border-primary chamfer-tr backdrop-blur-sm">
        <h4 className="font-headline font-bold text-primary uppercase mb-4 tracking-widest">
          System Guidelines
        </h4>
        <p className="text-sm text-[#c7fffe]/70 leading-relaxed font-body">
          All appointments are scheduled according to the official university
          calendar. Faculty members review requests based on academic priority
          and availability. We recommend booking your appointments at least 24
          hours in advance to ensure timely approval.
        </p>
      </div>
    </div>
  );
};

export default Protocols;
