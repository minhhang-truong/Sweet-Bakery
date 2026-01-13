import "./ChangePassWord.css";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import Header from '../../../components/admin/ManagerHeader.jsx';
import Footer from '../../../components/admin/ManagerFooter.jsx';
import ManagerSidebar from "../../../components/admin/ManagerSidebar.jsx";
import api from '../../../lib/axiosAdmin.js';

export default function ChangePassword() {
  const { user } = useAuth();
  const nav = useNavigate();
  
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Nếu chưa đăng nhập thì không render nội dung (hoặc chuyển hướng)
  if (!user) {
     return <div className="p-10 text-center">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Client
    if (form.newPassword.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      message.error("New password and confirmation do not match");
      return;
    }

    try {
      setLoading(true);

      // 2. Gọi API Backend (Đúng endpoint đã sửa trong Admin Route)
      // Route: PUT /manager/auth/change-password/:id
      await api.put(`/manager/auth/change-password/${user.id}`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      // 3. Thông báo thành công
      message.success("Password changed successfully!");
      
      // Reset form
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error("Change password error:", err);
      // Hiển thị lỗi từ Backend trả về (nếu có)
      const errorMsg = err.response?.data?.error || "Failed to change password";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header (Sticky Top) */}
      <div className="sticky top-0 z-30">
        <Header onMenuClick={() => setSidebarOpen(true)} />
      </div>

      <main className="change-password">
        <div className="container">
          <h1 className="cp__title">Change Password</h1>

          <div className="cp__content">
            {/* Form Section */}
            <section className="cp__card">
              <h2 className="cp__cardTitle">Create new password</h2>
              <p className="mb-4 text-sm text-gray-500">
                Your new password must be different from previous used passwords.
              </p>

              <form onSubmit={handleSubmit} className="cp__form">
                <label>
                  <span>Current password</span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                  />
                </label>

                <label>
                  <span>New password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </label>

                <label>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    required
                    minLength={6}
                  />
                </label>

                <div className="cp__actions">
                  <button 
                    type="submit" 
                    className="cp__btn"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change password"}
                  </button>
                  
                  <button
                    type="button"
                    className="cp__btn cp__btn--secondary"
                    onClick={() => nav("/manager/dashboard")} // Quay về dashboard hoặc profile
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>

            {/* Sidebar Info Section */}
            <aside className="cp__side">
              <section className="cp__card">
                <h2 className="cp__cardTitle">Password requirements</h2>
                <ul className="cp__list">
                  <li>At least 6 characters long</li>
                  <li>Different from your current password</li>
                  <li>Use a combination of letters and numbers for better security</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}