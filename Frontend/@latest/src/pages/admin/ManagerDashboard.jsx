import { useNavigate } from "react-router-dom";
import { FileText, Users, Plus, Cake } from "lucide-react";
import logoImg from '../../assets/images/common/logo-sweet-bakery.png';
import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const user = JSON.parse(localStorage.getItem("auth:user:v1")) || { name: "Admin" };

  const menuItems = [
    { icon: FileText, label: "Revenue Report", path: "/manager/revenue" },
    { icon: Users, label: "Human Resource\nManagement", path: "/manager/employees" },
    // { icon: Plus, label: "Add Product", path: "/manager/products" },
    { icon: Cake, label: "Products Details", path: "/manager/products" },
  ];

  const handleLogout = () => {
    auth.logout();
    navigate("/manager/signin");
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col shadow-r z-10">
        {/* Logo */}
        <div className="p-6">
          <div className="bg-card rounded-xl p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md">
            <div className="text-center">
              <img src={logoImg} alt="Sweet Bakery"/>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors text-left"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm whitespace-pre-line">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-card text-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors shadow-sm"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      {/* Cập nhật: thêm 'flex flex-col' để quản lý chiều cao các phần tử con */}
      <main className="flex-1 p-8 flex flex-col overflow-hidden">
        <div className="flex items-start justify-between mb-8 shrink-0">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-secondary mb-2 leading-tight">
              Welcome back,
            </h1>
            <h1 className="text-5xl lg:text-6xl font-bold text-secondary mb-4">{user.name}!</h1>
            <p className="text-xl text-muted-foreground">
              Manage your Bakery today!
            </p>
          </div>
          
          {/* --- THAY ĐỔI Ở ĐÂY --- */}
          {/* Đã thay thế các vòng tròn bằng icon Cake */}
          <div className="shrink-0">
            <Cake className="w-24 h-24 text-primary" />
          </div>
          {/* ----------------------- */}

        </div>

        <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-2xl relative mt-4">
            {/* Lớp phủ gradient nhẹ để ảnh trông hòa hợp hơn với nền (tùy chọn) */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-amber-700/10 to-transparent pointer-events-none z-10" />
          <img
            src="/images/menu/Bakery Image.jpg"
            alt="Bakery decorative"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;