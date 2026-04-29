import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        const parsed = JSON.parse(savedUser);
        console.log(
          "[AUTH_SYNC] Initial state recovered from localStorage:",
          parsed.name,
        );
        return parsed;
      }
    } catch (e) {
      console.error("[AUTH_SYNC] Failed to parse cached user", e);
    }
    return null;
  });
  const [loading, setLoading] = useState(
    !localStorage.getItem("user") && !!localStorage.getItem("token"),
  );
  const [error, setError] = useState(null);

  // Initial load: keep profile in sync with server
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("[AUTH_SYNC] Validating session with server...");
          const profile = await authService.getProfile();

          // Merge profile with existing token to ensure complete user object
          const updatedUser = { ...profile, token };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("[AUTH_SYNC] Session validated successfully.");
        } catch (err) {
          console.error(
            "[AUTH_SYNC] Session validation failed. Clearing state.",
            err,
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(userData);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.updateProfile(userData);
      setUser(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Profile update failed",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteAccount();
      setUser(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Account deletion failed",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
