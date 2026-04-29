import React from "react";

const NexusModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  type = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface-container-low border border-outline-variant/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] chamfer-tr-bl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Scanner/Glitch Overlay */}
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>

        {/* Decorative Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

        <div className="p-8 relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`p-3 rounded-sm ${type === "danger" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}
            >
              <span className="material-symbols-outlined text-2xl">
                {type === "danger" ? "warning" : "info"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tighter">
                {title}
              </h3>
              <div className="h-[1px] w-24 bg-gradient-to-r from-primary/50 to-transparent mt-1"></div>
            </div>
          </div>

          <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-10">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 py-4 font-headline font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-lg active:scale-95 ${
                type === "danger"
                  ? "bg-error text-on-error hover:bg-error/80 hover:shadow-error/20"
                  : "bg-primary text-on-primary hover:bg-primary/80 hover:shadow-primary/20"
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 font-headline font-bold text-xs tracking-[0.2em] uppercase text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-300 border border-outline-variant/20 active:scale-95"
            >
              {cancelText}
            </button>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="px-8 py-3 bg-surface-container-high/50 border-t border-outline-variant/10 flex justify-between items-center">
          <span className="text-[8px] font-mono text-outline-variant uppercase">
            Auth_Validation_Required
          </span>
          <span className="text-[8px] font-mono text-primary/40 uppercase">
            © Nexus_OS v4.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default NexusModal;
