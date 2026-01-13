import { useNavigate } from "react-router-dom";
import { FileText, Users, User, Cake } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // SỬA: Lấy fullname từ localStorage, fallback về name hoặc "Admin"
  const getGreetingName = () => {
    try {
        const stored = JSON.parse(localStorage.getItem("auth:user:v1"));
        return stored?.fullname || stored?.name || "Admin";
    } catch (e) {
        return "Admin";
    }
  }
  
  const userName = getGreetingName();

  const menuItems = [
    { icon: FileText, label: "Revenue Report", path: "/manager/revenue" },
    { icon: Users, label: "Human Resource\nManagement", path: "/manager/employees" },
    { icon: Cake, label: "Products Details", path: "/manager/products" },
    { icon: User, label: "Profile", path: "/manager/profile" },
  ];

  const handleLogout = () => {
    auth.logout();
    navigate("/manager/signin");
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar - Bạn giữ nguyên Sidebar hiện có */}
      {/* (Lược bỏ phần sidebar code tĩnh để tập trung vào phần chính cần sửa) */}
      
      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col overflow-hidden bg-white">
        <div className="flex items-start justify-between mb-8 shrink-0">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#d32f2f] mb-2 leading-tight">
              Welcome back,
            </h1>
            {/* SỬA: Hiển thị userName đã lấy ở trên */}
            <h1 className="text-5xl lg:text-6xl font-bold text-[#d32f2f] mb-4">{userName}!</h1>
            <p className="text-xl text-gray-500">
              Manage your Bakery today!
            </p>
          </div>
          
          <div className="shrink-0">
            <Cake className="w-24 h-24 text-[#d32f2f]" />
          </div>
        </div>

        <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-2xl relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
            {/* Ảnh Dashboard */}
            <img 
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2880&auto=format&fit=crop" 
              alt="Bakery Dashboard" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="group bg-white/90 backdrop-blur-md hover:bg-[#d32f2f] hover:text-white transition-all duration-300 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4 text-center h-48 border border-white/20"
                  >
                    <div className="p-4 bg-[#d32f2f]/10 group-hover:bg-white/20 rounded-full transition-colors">
                      <item.icon className="w-8 h-8 text-[#d32f2f] group-hover:text-white" />
                    </div>
                    <span className="font-bold text-lg whitespace-pre-line leading-tight text-gray-800 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;