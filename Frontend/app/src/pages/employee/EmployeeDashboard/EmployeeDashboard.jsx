// src/pages/EmployeeDashboard.jsx
import React from 'react';
import { PiUserCircleLight } from "react-icons/pi";
import styles from './EmployeeDashboard.module.css';
import Sidebar from '../../../components/employee/Sidebar/Sidebar';
import cakeImage from '../../../assets/images/employee/dashboard/fruit-cream-bread.png';

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("auth:user:v1")) || { name: "Employee" };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          <div className={styles.greetingBox}>
            <h1 className={styles.greetingTitle}>
              Hello, <br />
              {user.name}!
            </h1>
            <p className={styles.subTitle}>
              Sweet Bakery is glad to see you back!
            </p>
          </div>

          <div className={styles.userIconWrapper}>
            <PiUserCircleLight />
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.foodImageWrapper}>
            <img 
              src={cakeImage} 
              alt="Delicious Toast" 
              className={styles.foodImage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;