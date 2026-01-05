// src/components/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// Import Icon (Mình dùng icon cái bánh và bảng ghi chú cho giống hình)
import { BiCake, BiClipboard, BiUser } from "react-icons/bi"; 
// Import ảnh logo (Nếu chưa có file logo, bạn có thể comment dòng này lại)
import logoImg from '../../../assets/images/common/logo-sweet-bakery.png'; 

import styles from './Sidebar.module.css';

const Sidebar = () => {
  const auth = useAuth();
  const nav = useNavigate();
  return (
    <aside className={styles.sidebar}>
      
      {/* 1. LOGO SECTION */}
      <div className={styles.logoContainer}>
        <div className={styles.logoBox}>
          {/* Thay src bằng đường dẫn logo thật của bạn */}
          <img 
            src={logoImg} 
            alt="Logo" 
            style={{width: '100%', height: '100%'}} 
          />
        </div>
        {/* <span className={styles.logoText}>Sweet Bakery</span> */}
      </div>

      {/* 2. MENU SECTION */}
      <nav className={styles.menuContainer}>
        {/* Link 1: Order Management */}
        <NavLink 
          to="/employee/management/orders"
          // Logic: Nếu đang active thì ghép thêm class .active, không thì thôi
          className={({ isActive }) => 
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          <BiCake className={styles.icon} />
          Order Management
        </NavLink>

        {/* Link 2: Stock Management */}
        <NavLink 
          to="/employee/management/stock" 
          className={({ isActive }) => 
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          <BiClipboard className={styles.icon} />
          Stock Management
        </NavLink>

        {/* Link 3: Your Profile */}
        <NavLink 
          to="/employee/profile" 
          className={({ isActive }) => 
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          <BiUser className={styles.icon} />
          My Profile
        </NavLink>

      </nav>

      {/* 3. LOGOUT SECTION */}
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton}
        onClick={() => {
          auth.logout();
          nav("/employee/signin");
        }}>
          Log out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;