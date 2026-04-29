import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="relative pt-24 bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 grid-pattern z-0 opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 scanline z-10 pointer-events-none opacity-10"></div>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-96px)] flex items-center px-8 md:px-16 overflow-hidden border-b border-outline-variant/20 z-20">
        <div className="relative z-20 w-full max-w-6xl py-24 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-3/5">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-12 h-px bg-primary"></span>
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">
                Status: Active // Scheduling Open
              </span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-on-background leading-none mb-8">
              UNIMEET NEXUS: THE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container drop-shadow-[0_0_20px_rgba(199,255,254,0.4)]">
                APPOINTMENT NETWORK
              </span>{" "}
              FOR ACADEMIA
            </h1>
            <p className="text-on-surface-variant text-xl md:text-2xl max-w-2xl mb-12 font-light leading-relaxed">
              Seamlessly schedule your sessions with expert faculty. Secure your
              academic future through precision coordination protocols.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/register"
                className="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-black tracking-widest uppercase text-lg group relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(199,255,254,0.6)] text-center"
              >
                <span className="relative z-10">START SCHEDULING</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/protocols"
                className="px-10 py-5 border border-primary/20 text-primary font-bold tracking-widest uppercase text-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">description</span>
                HOW IT WORKS
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/5 relative">
            <div className="aspect-square relative bg-surface-container-high chamfer-card overflow-hidden group">
              <img
                className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:scale-110 transition-transform duration-1000"
                alt="High-tech futuristic data visualization"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk6XMqXlHEEh2jmnhzTVF9yJcbK03hnyhqoFYWtQC0iuxmQql8rsDbd5bs9r2iSnMkAB-3Jc3NWOFSegpzcbUCQtNslE3iLmpSE0bg-HhHT-f3D6YV-i8Q3miwXFYqwsJK7lxnRwkRxqAD_R7N-SkYpDON91mdeuVFA4WwdplIkLf5RZEfTygDNTfPPdUFEgm5H9Kb2_tjX3Lp3HnGbQxvqZiFWy7Lr8UOWIEMf6HgAUDdmOXQPTkhqXM0c6o0yk8eYmH6iIs-WuyQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 p-4 border-l-2 border-t-2 border-primary w-12 h-12"></div>
              <div className="absolute bottom-4 right-4 p-4 border-r-2 border-b-2 border-primary w-12 h-12"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 px-8 md:px-16 bg-surface-container-lowest relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight uppercase text-on-background">
                Network <span className="text-primary">Services</span>
              </h2>
              <p className="text-on-surface-variant font-label text-sm tracking-widest uppercase mt-4">
                Core services for academic excellence
              </p>
            </div>
            <div className="hidden md:block h-px flex-grow mx-12 bg-outline-variant/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dynamic Scheduling */}
            <div className="bg-surface-container-low p-8 md:p-12 relative overflow-hidden chamfer-card group border border-outline-variant/10 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 font-label text-[10px] text-primary/40 tracking-[0.2em]">
                SERVICE: SCH_01
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center mb-8 border border-primary/20">
                    <span className="material-symbols-outlined text-4xl">
                      schedule
                    </span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-4 tracking-tighter uppercase">
                    Dynamic Scheduling
                  </h3>
                  <p className="text-on-surface-variant text-lg max-w-md">
                    Real-time faculty availability. Synchronize your academic
                    schedule with precision coordination.
                  </p>
                </div>
                <div className="mt-12 bg-surface-container-highest/50 p-6 border-l-4 border-primary">
                  <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-primary mb-4">
                    <span className="inline-block w-2 h-2 bg-primary animate-pulse"></span>{" "}
                    Real-time Availability Sync
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-12 bg-primary/20"></div>
                    <div className="h-12 bg-primary/40"></div>
                    <div className="h-12 bg-primary/10"></div>
                    <div className="h-12 bg-primary/60"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[300px]">
                  radar
                </span>
              </div>
            </div>

            {/* Academic Collaboration */}
            <div className="bg-surface-container-high p-8 md:p-12 relative overflow-hidden chamfer-card border border-outline-variant/10 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 font-label text-[10px] text-primary/40 tracking-[0.2em]">
                SERVICE: COL_02
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center mb-8 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl">
                    groups
                  </span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4 tracking-tighter uppercase">
                  Academic Collaboration
                </h3>
                <p className="text-on-surface-variant text-lg mb-8">
                  Seamless student-faculty communication. Facilitating
                  productive sessions for academic growth.
                </p>
                <div className="mt-auto relative">
                  <img
                    className="w-full h-48 object-cover chamfer-card mix-blend-lighten opacity-60"
                    alt="Neural pathways"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcuqyM_sekGHDhxkdcDgMUSX_H9I1EthGV6Bo3oTG-Vn2YowYA5s6Rkx1_h1PqSwVyInQUmr1OZc6lJJQkf7Iw5YrDMP2rhDZb92Pv7aJtRw2vqBUlCdiEwiXtvGnp7_R14-Ul2ff8KF59x8D2eeIEC1-6ITl6tbNLYsOu5nPNIf4hO6Z_hGbTSOnuWH8MgcWCGGxFSQXKbZLIdFxkQdXh60KVRamQp9H-Gwc4dSTi7XC2H0lPmivuxN1yZ6wruYePedUOQUm9EV35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <div className="inline-block border border-primary/40 px-4 py-1 mb-8">
            <span className="text-primary font-label text-[10px] tracking-[0.4em] uppercase">
              Ready for Excellence
            </span>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black text-on-background tracking-tighter uppercase mb-8 leading-tight">
            START YOUR <span className="text-primary">ACADEMIC JOURNEY</span>{" "}
            TODAY
          </h2>
          <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto font-light">
            Join the leading network for faculty interaction. Accessible to all
            students across the university ecosystem.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="px-12 py-6 bg-primary text-on-primary font-black tracking-[0.2em] uppercase text-xl chamfer-card hover:shadow-[0_0_40px_rgba(199,255,254,0.5)] transition-all active:scale-95 text-center"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
