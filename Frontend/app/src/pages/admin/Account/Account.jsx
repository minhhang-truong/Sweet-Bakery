import "./Account.css";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLockAlt, BiSave, BiUser } from "react-icons/bi";
import { message } from "antd";

import { toISODate } from "../../../lib/formDate";
import api from "../../../lib/axiosAdmin";

import Header from "../../../components/admin/ManagerHeader";
import Footer from "../../../components/admin/ManagerFooter";
import ManagerSidebar from "../../../components/admin/ManagerSidebar";
import ImageUploadZone from "../../../components/admin/ImageUploadZone";

export default function Account() {
  const { user, updateUser } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    avatar: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/manager/auth/profile/${user.id}`);

        setForm({
          fullname: res.data.fullname,
          email: res.data.email,
          phone: res.data.phone || "",
          address: res.data.address || "",
          dob: res.data.dob ? toISODate(res.data.dob) : "",
          avatar: res.data.avatar || "",
          department: res.data.department || "",
        });
      } catch (err) {
        message.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [user]);

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        fullname: form.fullname,
        email: form.email,
        phone: form.phone,
        address: form.address,
        dob: form.dob,
        department: form.department,
        avatar: form.avatar,
      };

      const res = await api.put(`/manager/auth/profile/${user.id}`, payload);

      setForm((prev) => ({
        ...prev,
        ...res.data,
        dob: res.data.dob ? toISODate(res.data.dob) : "",
      }));

      updateUser({
        fullname: res.data.fullname,
        email: res.data.email,
        name: res.data.fullname.split(" ")[0],
      });

      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AVATAR UPLOADED ================= */
  const handleAvatarUploaded = async (url) => {
    setForm((prev) => ({ ...prev, avatar: url }));
  };

  return (
    <>
      <ManagerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* HEADER */}
      <div className="sticky top-0 z-30">
        <Header onMenuClick={() => setSidebarOpen(true)} />
      </div>

      <main className="emp-profile">
        <h1 className="emp-profile__title">Manager Profile</h1>

        <div className="emp-profile__card">
          {/* ================= HEADER ================= */}
          <div className="emp-profile__header">
            {/* AVATAR */}
            <div className="emp-profile__avatar">
              <ImageUploadZone
                image={form.avatar}
                uploadEndpoint={`/manager/upload/avatar`}
                onImageUploaded={handleAvatarUploaded}
                className="w-[180px] h-[180px]"
              />
            </div>

            {/* BASIC INFO */}
            <div className="emp-profile__basic">
              <h2>{form.fullname}</h2>
              <p className="emp-profile__role">Manager</p>
              <p className="emp-profile__status active">
                Status: Active
              </p>
            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="emp-profile__form">
            <label>
              <span>Full name</span>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Address</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Date of birth</span>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Department</span>
              <input
                name="department"
                disabled
                value={form.department}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="emp-profile__actions">
            <button
              className="emp-profile__btn"
              onClick={handleSave}
              disabled={loading}
            >
              <BiSave />
              {loading ? "Saving..." : "Save changes"}
            </button>

            <button
              className="emp-profile__btn emp-profile__btn--secondary"
              onClick={() => nav("/manager/change-password")}
            >
              <BiLockAlt />
              Change Password
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}