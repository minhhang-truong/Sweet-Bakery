import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Users, User, Cake, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/images/common/logo-sweet-bakery.png';

const ManagerSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Sử dụng màu đỏ từ hình ảnh cho tất cả các trang để đồng nhất.
  const theme = {
    bg: "bg-[#d32f2f]",       // Màu Đỏ từ hình ảnh
    text: "text-white",       // Chữ màu trắng để nổi trên nền đỏ
    hover: "hover:bg-white/10",
    active: "bg-white/20 font-bold shadow-inner",
    logoutBtn: "bg-white text-[#d32f2f] hover:bg-gray-100 shadow-md",
    closeBtn: "text-white hover:bg-white/20 rounded-full p-1",
    // logoTextSecondary: "text-white" // Chữ "BAKERY" màu trắng
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/manager/dashboard", key: "Dashboard" },
    { icon: FileText, label: "Revenue Report", path: "/manager/revenue", key: "Revenue Report" },
    { icon: Users, label: "Human Resource\nManagement", path: "/manager/employees", key: "Human Resource" },
    { icon: Cake, label: "Products Details", path: "/manager/products", key: "Products Details" },
    { icon: User, label: "Profile", path: "/manager/profile", key: "Profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    auth.logout()
    navigate("/manager/signin");
    onClose();
  };

  return (
    <>
      {/* 1. OVERLAY (Lớp phủ đen mờ) */}
      {/* Luôn hoạt động trên mọi màn hình khi isOpen = true */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* 2. SIDEBAR (Ngăn kéo trượt) */}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-screen w-72 flex flex-col 
          transition-transform duration-300 ease-in-out shadow-2xl
          ${theme.bg}
          /* Logic trượt: Dựa hoàn toàn vào isOpen, không phân biệt mobile/desktop */
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Nút đóng Sidebar (X) */}
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className={theme.closeBtn}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 pt-12">
          <div className="bg-card rounded-xl p-3 w-20 h-20 mx-auto flex items-center justify-center shadow-md bg-white">
            <img 
              src={logoImg} 
              alt="Logo"
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                  theme.text
                } ${isActive ? theme.active : theme.hover}`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[3px]' : ''}`} />
                <span className={`text-base font-medium whitespace-pre-line leading-tight ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 pb-8 mt-auto">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold transition-transform active:scale-95 ${theme.logoutBtn}`}
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default ManagerSidebar;