import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import NexusModal from "../components/NexusModal";

const Settings = () => {
  const { user, logout, updateProfile, deleteAccount } =
    useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // Sync form data when user context updates
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleAccountDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      await updateProfile(updateData);
      toast.success("Profile updated successfully");
      setIsEditMode(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8 border-b border-outline-variant/20 pb-6">
        <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
          System Configuration
        </p>
        <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface uppercase mt-2">
          Settings
        </h1>
        <p className="text-on-surface-variant font-label tracking-widest uppercase text-xs mt-2">
          Manage your profile, security, and account preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Overview Card */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          <div className="bg-surface-container border border-outline-variant/20 p-6 chamfer-tr">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-surface-container-highest border-2 border-primary/20 rounded-full flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-primary/40">
                  person
                </span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-headline font-bold text-on-surface uppercase tracking-wider">
                  {user?.name}
                </h2>
                <p className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mt-1">
                  {user?.role?.replace("_ROLE", "") || "USER"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-error/20 p-6 chamfer-br">
            <h3 className="font-headline text-error uppercase text-sm font-bold tracking-widest mb-4">
              Danger Zone
            </h3>
            <p className="font-label text-xs text-on-surface-variant uppercase mb-6">
              Manage critical account actions. These actions are permanent and
              cannot be undone.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isDeleting}
                className="w-full py-4 px-6 bg-error/10 hover:bg-error/20 text-error border border-error/50 font-headline font-bold uppercase tracking-widest transition-all chamfer-btn disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    delete_forever
                  </span>
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Editor Configuration */}
        <div className="col-span-1 md:col-span-8 bg-surface-container p-8 border border-outline-variant/20 chamfer-both">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-4">
            <h3 className="font-headline text-primary uppercase text-lg tracking-widest">
              Account Details
            </h3>
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-[10px] px-4 py-2 border border-primary/40 text-primary hover:bg-primary/10 transition-colors font-headline tracking-widest uppercase"
            >
              {isEditMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditMode}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-surface-container-highest border border-outline-variant/20 p-3 text-sm font-body text-on-surface disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
                  Contact Email
                </label>
                <input
                  type="email"
                  disabled={!isEditMode}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-surface-container-highest border border-outline-variant/20 p-3 text-sm font-body text-on-surface disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Password changes are usually only accessible in edit mode */}
              {isEditMode && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-highest border border-outline-variant/20 p-3 text-sm font-body text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-highest border border-outline-variant/20 p-3 text-sm font-body text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </>
              )}
            </div>

            {isEditMode && (
              <div className="pt-6 mt-6 border-t border-outline-variant/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,240,240,0.3)] transition-all chamfer-btn disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      {/* Action Modals */}
      <NexusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAccountDelete}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? All your appointments, slots, and profile data will be removed forever."
        confirmText="DELETE ACCOUNT"
        cancelText="CANCEL"
        type="danger"
      />
    </div>
  );
};

export default Settings;
