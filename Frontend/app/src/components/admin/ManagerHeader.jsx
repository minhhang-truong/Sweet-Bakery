import { Menu, User } from "lucide-react";
import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/images/common/logo-sweet-bakery.png';

const ManagerHeader = ({ onMenuClick, userRole = "Owner" }) => {
  const [user, setUser] = useState({
    name: "Admin",
    email: "",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("auth:user:v1");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // SỬA: Backend trả về fullname, nên ưu tiên lấy fullname
        setUser({
            name: parsedUser.fullname || parsedUser.name || "Admin",
            email: parsedUser.email || ""
        });
      }
    } catch (err) {
      console.error("Invalid user in localStorage");
    }
  }, []);

  return (
    <header className="bg-primary h-14 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="text-primary-foreground hover:opacity-70 transition-opacity mr-4"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="bg-card rounded-lg p-1.5 w-10 h-10 flex items-center justify-center">
        <img src={logoImg} alt="Logo" />
      </div>

      <div className="ml-6 bg-card rounded-full px-4 py-2 flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-full border border-muted-foreground flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground leading-tight">
            Sweet Bakery
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">
            Management System
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-primary-foreground leading-none">
            {user.name}
          </p>
          <p className="text-xs text-primary-foreground/80 font-medium">
            {userRole}
          </p>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-card border-2 border-primary-foreground/20 flex items-center justify-center text-primary font-bold shadow-md">
           {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;