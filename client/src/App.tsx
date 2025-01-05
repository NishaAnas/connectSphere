import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/User/Home";
import Header from "./Components/User/Header";
import Login from "./Components/User/Login";
import Signup from "./Components/User/Signup";
import ForgotPassword from "./Components/User/ForgotPassword";
import OTPVerification from "./Components/User/OtpVerification";
import ResetPassword from "./Components/User/ResetPassword";
import Profile from "./Components/User/Profile";
import Categories from "./Components/Admin/Categories";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Components/User/PrivateRoute";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminProfile from "./Components/Admin/AdminProfile";
import PageNotFound from "./Components/PageNotFound";
import AdminLayout from "./Components/Layouts/AdminLayout";
import SubCategories from "./Components/Admin/SubCategories";
import Skills from "./Components/Admin/Skills";
import UserManage from "./Components/Admin/UserManage";

function App() {
  const location = useLocation();

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Only render AdminSidebar when it's an admin route */}
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories/:categoryId" element={<SubCategories />} />
            <Route path="skills/:categoryId/:subcategoryId" element={<Skills />} />
            <Route path="user" element={<UserManage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : (
        // Non-admin routes render the normal Header
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTPVerification />} />
            <Route path="/reset" element={<ResetPassword />} />

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </>
      )}
      <Toaster />
    </>
  );
}

export default App;
