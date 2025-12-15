// src/components/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Drawer } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
// Import icon từ react-icons (Giống hình mẫu nhất)
import { BiCake, BiClipboard } from "react-icons/bi"; 

import './ManagementLayout.css';

const MainLayout = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* --- HEADER --- */}
      <div className="header">
        <MenuOutlined className="menu-icon" onClick={showDrawer} />
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Sweet Bakery</div>
      </div>

      {/* --- SIDEBAR (DRAWER) --- */}
      <Drawer 
        // 1. Bỏ title, bỏ nút đóng X để nó chỉ còn là các khối màu
        title={null} 
        closable={false}
        
        placement="left" 
        onClose={onClose} 
        open={visible}
        
        // Class này để ăn CSS vừa viết
        rootClassName="custom-drawer" 
        
        width={300}
        
        // 2. Làm mờ nền ít thôi cho đỡ tối (Optional)
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="sidebar-menu">
          <Link to="/employee/management/orders" className="sidebar-item" onClick={onClose}>
            <BiCake className="sidebar-icon" />
            Order Management
          </Link>

          <Link to="/employee/management/stock" className="sidebar-item" onClick={onClose}>
            <BiClipboard className="sidebar-icon" />
            Stock Management
          </Link>
        </div>
      </Drawer>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '0 40px' }}>
        <div className="user-info-card">
          <div className="user-avatar"><UserOutlined /></div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Ngo Minh Ngoc - Employee</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Mail: ngoc.mn235984@sis.hust.edu.vn</div>
          </div>
        </div>

        <Outlet />
      </div>

      {/* --- FOOTER --- */}
      <div className="footer">
        <div className="footer-logo-section">
          <h2 style={{ margin: 0, fontFamily: 'cursive' }}>Sweet Bakery</h2>
          <p>No 1 Dai Co Viet, Hai Ba Trung, Ha Noi</p>
          <p>+84 123456789</p>
        </div>
        <div className="footer-links">
           <p>Home | Menu | About Us</p>
           <p>© 2025 Savor Cake. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;