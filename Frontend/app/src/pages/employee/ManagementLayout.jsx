import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import Footer from '../../components/common/Footer/Footer.jsx';
import Header from '../../components/employee/Header/Header.jsx';
import './ManagementLayout.css'; 

const MainLayout = () => {
  // SỬA: Lấy fullname từ localStorage (hoặc name nếu fullname null)
  const getGreetingName = () => {
      try {
          const u = JSON.parse(localStorage.getItem('auth:user:v1'));
          return u?.fullname || u?.name || "Employee";
      } catch (e) { return "Employee"; }
  }
  const userName = getGreetingName();
  const userEmail = JSON.parse(localStorage.getItem('auth:user:v1'))?.email || "";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, padding: '0 40px' }}>
        
        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-avatar"><UserOutlined /></div>
          <div>
            {/* Hiển thị fullname */}
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{userName} - Staff</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{userEmail}</div>
          </div>
        </div>

        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;