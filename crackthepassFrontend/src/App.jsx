import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import UserLogin from "./User/UserLogin";
import UserSignup from "./User/UserSignup";
import CrackPass from "./User/CrackPass";

function App() {
  const isAuthenticated = localStorage.getItem("adminToken") !== null;
  const isUserAuthenticated = localStorage.getItem("adminToken") !== null;
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Default redirect to Admin Login */}
          <Route path="/" element={<Navigate to="/admin/login" />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />

          {/* User Routes */}
          <Route path="/user/login" element={ <UserLogin /> }/>
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/crackPass" 
           element={ isUserAuthenticated ? <CrackPass />: <Navigate to="/user/login" />}
           />
        </Routes>
      </Router>
    </>
  );
}

export default App;
