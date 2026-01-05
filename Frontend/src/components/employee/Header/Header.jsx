// src/components/common/Header/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
// Import icon sidebar
import { BiCake, BiClipboard, BiGridAlt, BiUser } from "react-icons/bi"; 
import './Header.css';

const Header = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <>
      {/* --- HEADER BAR --- */}
      <div className="header">
        <MenuOutlined className="menu-icon" onClick={showDrawer} />
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Sweet Bakery</div>
      </div>

      {/* --- SIDEBAR (DRAWER) --- */}
      <Drawer 
        title={null} 
        closable={false}
        placement="left" 
        onClose={onClose} 
        open={visible}
        rootClassName="custom-drawer" 
        width={300}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="sidebar-menu">
          <Link to="/employee" className="sidebar-item" onClick={onClose}>
            <BiGridAlt className="sidebar-icon" />
            Dashboard
          </Link>

          <Link to="/employee/management/orders" className="sidebar-item" onClick={onClose}>
            <BiCake className="sidebar-icon" />
            Order Management
          </Link>

          <Link to="/employee/management/stock" className="sidebar-item" onClick={onClose}>
            <BiClipboard className="sidebar-icon" />
            Stock Management
          </Link>

          <Link to="/employee/profile" className="sidebar-item" onClick={onClose}>
            <BiUser className="sidebar-icon" />
            My Profile
          </Link>
        </div>
      </Drawer>
    </>
  );
};

export default Header;