import React, { useState } from "react";
import { reportIssue } from "../services/issueService";
import toast from "react-hot-toast";

const ReportIssue = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "OTHER",
    priority: "MEDIUM",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportIssue(formData);
      toast.success("Issue reported successfully. Admin will review it.");
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-high p-8 border border-outline-variant/30 chamfer-tr-bl relative">
      <h2 className="text-2xl font-headline font-bold text-primary uppercase mb-6 tracking-widest">
        Report System Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-label text-primary uppercase tracking-[0.2em] mb-2">
            Subject / Headline
          </label>
          <input
            type="text"
            required
            placeholder="Brief summary of the problem"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full bg-surface-container p-4 text-sm font-body text-on-surface border border-transparent focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-label text-primary uppercase tracking-[0.2em] mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-surface-container p-4 text-sm font-body text-on-surface border border-transparent focus:border-primary outline-none transition-all uppercase appearance-none cursor-pointer"
            >
              <option value="TECHNICAL">Technical Bug</option>
              <option value="APPOINTMENT">Booking Issue</option>
              <option value="BEHAVIORAL">User Conduct</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-label text-primary uppercase tracking-[0.2em] mb-2">
              Urgency Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full bg-surface-container p-4 text-sm font-body text-on-surface border border-transparent focus:border-primary outline-none transition-all uppercase appearance-none cursor-pointer"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-label text-primary uppercase tracking-[0.2em] mb-2">
            Detailed Description
          </label>
          <textarea
            required
            rows="4"
            placeholder="Provide as much detail as possible..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-surface-container p-4 text-sm font-body text-on-surface border border-transparent focus:border-primary outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-outline-variant/30 text-outline-variant font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,240,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
