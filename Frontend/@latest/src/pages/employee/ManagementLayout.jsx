// src/components/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Drawer } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import './ManagementLayout.css'; // Import CSS

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
      <Drawer title="Menu" placement="left" onClose={onClose} open={visible}>
        <p><Link to="/orders" onClick={onClose}>Order Management</Link></p>
        <p><Link to="/stock" onClick={onClose}>Stock Management</Link></p>
      </Drawer>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '0 40px' }}>
        {/* User Info Section (Dùng chung cho cả 2 trang) */}
        <div className="user-info-card">
          <div className="user-avatar"><UserOutlined /></div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Ngo Minh Ngoc - Employee</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Mail: ngoc.mn235984@sis.hust.edu.vn</div>
          </div>
        </div>

        {/* Nội dung thay đổi (Order hoặc Stock) sẽ hiện ở đây */}
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