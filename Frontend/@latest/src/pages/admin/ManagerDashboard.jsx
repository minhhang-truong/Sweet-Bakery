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
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="bg-card rounded-xl p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md">
            <img src={logoImg} alt="Logo"/>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
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
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="bg-card text-foreground px-6 py-2 rounded-full font-medium hover:bg-muted transition-colors w-full"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          {/* Welcome Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold text-secondary mb-2">
                Welcome back,
              </h1>
              <h1 className="text-6xl font-bold text-secondary mb-4">{user.name}!</h1>
              <p className="text-xl text-muted-foreground">
                Manage your Bakery today!
              </p>
            </div>
            {/* User Icon */}
            <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-primary"></div>
              </div>
            </div>
          </div>

          {/* Decorative Image Area */}
          <div className="mt-12 flex justify-end">
            <div className="w-96 h-64 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Bakery Image</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
