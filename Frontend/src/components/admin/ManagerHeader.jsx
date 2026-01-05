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
        setUser(JSON.parse(storedUser));
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

        <div className="text-sm">
          <div className="font-medium text-foreground">
            {user.name} - {userRole}
          </div>
          <div className="text-xs text-muted-foreground">
            Mail: {user.email || "--"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
