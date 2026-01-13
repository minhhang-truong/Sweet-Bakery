import "./Account.css";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLockAlt, BiSave } from "react-icons/bi";
import { message } from "antd";

import { toISODate } from "../../../lib/formDate";
import api from "../../../lib/axiosAdmin";

import Header from "../../../components/admin/ManagerHeader";
import Footer from "../../../components/admin/ManagerFooter";
import ManagerSidebar from "../../../components/admin/ManagerSidebar";
import ImageUploadZone from "../../../components/admin/ImageUploadZone";

export default function Account() {
  const { user, updateUser } = useAuth(); // updateUser là hàm update context
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
        // Backend trả về: fullname, email, phone, address, dob, avatar, department
        setForm({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          dob: res.data.dob ? toISODate(res.data.dob) : "",
          avatar: res.data.avatar || "",
          department: res.data.department || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        message.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [user]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HANDLE SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // SỬA QUAN TRỌNG: Map 'fullname' thành 'name' để khớp với Backend Model
      const payload = {
          ...form,
          name: form.fullname, // Backend cần field 'name' để tách first/last
      };

      const res = await api.put(`/manager/auth/profile/${user.id}`, payload);

      message.success("Profile updated successfully");
      
      // Cập nhật lại Context/LocalStorage nếu cần
      if (updateUser) {
          updateUser({ ...user, fullname: form.fullname, avatar: form.avatar });
      }
      
    } catch (err) {
      console.error("Update failed", err);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sticky top-0 z-30">
          <Header onMenuClick={() => setSidebarOpen(true)} />
      </div>

      <main className="emp-profile">
        <h1 className="emp-profile__title">My Profile</h1>
        
        <div className="emp-profile__card">
          <div className="emp-profile__header">
             {/* Component Upload Ảnh (Giữ nguyên) */}
             <div className="emp-profile__avatar">
                <ImageUploadZone 
                    image={form.avatar}
                    onImageUploaded={(file) => {
                        // file ở đây có thể là URL hoặc File Object tùy component ImageUploadZone trả về
                        // Giả sử trả về URL hoặc xử lý upload ngay tại component đó
                        // Ở đây ta tạm set vào form để hiển thị
                         if(typeof file === 'string') setForm(prev => ({...prev, avatar: file}));
                    }}
                    uploadEndpoint="/manager/upload/avatar" // Endpoint upload
                />
             </div>
             <div>
                 <h2 className="text-xl font-bold">{form.fullname}</h2>
                 <p className="emp-profile__role">Administrator</p>
             </div>
          </div>

          <div className="emp-profile__info">
            <label>
              <span>Full Name</span>
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
                disabled // Thường không cho sửa email đăng nhập
                className="bg-gray-100 cursor-not-allowed"
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
                value={form.department || "Management"}
                className="bg-gray-100 cursor-not-allowed"
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