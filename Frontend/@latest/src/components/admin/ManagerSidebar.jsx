import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Users, Plus, Cake, X, LayoutDashboard } from "lucide-react";
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
    active: "bg-white/20",
    logoutBtn: "bg-white text-[#d32f2f] hover:bg-gray-100",
    closeBtn: "text-white",
    logoTextSecondary: "text-white" // Chữ "BAKERY" màu trắng
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/manager/dashboard" },
    { icon: FileText, label: "Revenue Report", path: "/manager/revenue" },
    { icon: Users, label: "Human Resource\nManagement", path: "/manager/employees" },
    // { icon: Plus, label: "Add Product", path: "/manager/products" },
    { icon: Cake, label: "Products Details", path: "/manager/products" },
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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-slide w-52 flex flex-col h-screen transition-colors duration-300 ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        } ${theme.bg}`} // Áp dụng màu nền đỏ đồng nhất
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 hover:opacity-70 ${theme.closeBtn}`}
        >
          <X className="w-5 h-5" />
        </button>

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
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left ${theme.text} ${theme.hover} ${
                location.pathname === item.path ? theme.active : ""
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs whitespace-pre-line font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors w-full shadow-sm ${theme.logoutBtn}`}
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default ManagerSidebar;