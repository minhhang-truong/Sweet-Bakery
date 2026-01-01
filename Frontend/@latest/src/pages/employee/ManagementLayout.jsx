
// src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import Footer from '../../components/common/Footer/Footer.jsx';
import Header from '../../components/employee/Header/Header.jsx';
import './ManagementLayout.css'; // Giữ file CSS ở đây

const MainLayout = () => {
  // Lấy thông tin user (Logic này thuộc về Layout tổng)
  const user = JSON.parse(localStorage.getItem('auth:user:v1')) || {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- HEADER & SIDEBAR --- */}
      <Header />

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '0 40px' }}>
        
        {/* User Info Card (Giữ lại ở MainLayout vì nó nằm trong phần content) */}
        <div className="user-info-card">
          <div className="user-avatar"><UserOutlined /></div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name} - Employee</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Mail: {user.email}</div>
          </div>
        </div>

        {/* Nội dung trang con sẽ hiện ở đây */}
        <Outlet />
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default MainLayout;