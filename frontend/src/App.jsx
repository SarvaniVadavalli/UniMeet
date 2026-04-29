import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ManageSlots from "./pages/ManageSlots";
import AppointmentHistory from "./pages/AppointmentHistory";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyList from "./pages/FacultyList";
import FacultyProfile from "./pages/FacultyProfile";
import Notifications from "./pages/Notifications";
import Protocols from "./pages/Protocols";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportIssue from "./components/ReportIssue";

const IssuePage = () => (
  <div className="max-w-3xl mx-auto py-10">
    <ReportIssue />
  </div>
);

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-background text-on-background font-body min-h-screen">
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "font-label text-sm uppercase tracking-widest",
              style: {
                background: "#121212",
                color: "#e2e2e2",
                border: "1px solid rgba(0, 240, 240, 0.2)",
                borderRadius: "0px",
              },
              success: {
                iconTheme: { primary: "#00f0f0", secondary: "#121212" },
              },
              error: {
                iconTheme: { primary: "#ff3366", secondary: "#121212" },
                style: { borderColor: "rgba(255, 51, 102, 0.2)" },
              },
            }}
          />
          <Routes>
            {/* Public Routes wrapped with existing NavBar and Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/protocols" element={<Protocols />} />
            </Route>

            <Route
              path="/report-issue"
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT_ROLE", "FACULTY_ROLE", "ADMIN_ROLE"]}
                >
                  <IssuePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (Wrapper internally handles NexusLayout) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT_ROLE", "FACULTY_ROLE", "ADMIN_ROLE"]}
                >
                  <FacultyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT_ROLE", "FACULTY_ROLE", "ADMIN_ROLE"]}
                >
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route path="/archives" element={<Navigate to="/" replace />} />

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_ROLE"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_ROLE"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty-dashboard"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ROLE"]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-slots"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ROLE"]}>
                  <ManageSlots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment-requests"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ROLE"]}>
                  <AppointmentHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN_ROLE"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN_ROLE"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={["ADMIN_ROLE"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/issues"
              element={
                <ProtectedRoute allowedRoles={["ADMIN_ROLE"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse-faculty"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_ROLE", "FACULTY_ROLE"]}>
                  <FacultyList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
