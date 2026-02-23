import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

/* Public */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import Blog from "./pages/Blog";

/* User */
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";          // correct
import ApplyPage from "./pages/Applypage";            // small p
import Profile from "./pages/Profile";
import MyApplications from "./pages/Myapplications";  // small a
import UserDashboard from "./pages/Userdashboard";    // small d

/* Admin */
import AdminDashboard from "./pages/Admindashboard";        // small d
import ManageJobs from "./pages/Managejobs";                // small j
import AdminApplications from "./pages/Adminapplications";  // small a
import AdminUsers from "./pages/Adminuser";                 // singular + small u
import AddJob from "./pages/Addjob";                        // small j

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/blog" element={<Blog />} />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* USER */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <AdminRoute>
              <ManageJobs />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <AdminRoute>
              <AdminApplications />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-job"
          element={
            <AdminRoute>
              <AddJob />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;