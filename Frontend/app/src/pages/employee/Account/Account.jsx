import React, { useEffect, useState } from 'react';
import { Input, Button, message, DatePicker, Spin } from 'antd';
import {
  CloudUploadOutlined,
  LoadingOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../../components/employee/Header/Header.jsx';
import Footer from '../../../components/common/Footer/Footer.jsx';
import styles from './Account.module.css';
import api from "../../../lib/axiosEmployee.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toISODate } from '../../../lib/formDate.js';
import AvatarUpload from "../../../components/employee/Upload/Upload.jsx";

const Account = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/employee/auth/profile/${user.id}`);
        const data = res.data;

        // SỬA: Map dữ liệu từ Backend (snake_case hoặc tên cột DB mới) sang State Frontend
        setProfile({
          id: data.id,
          fullName: data.fullname, // Backend trả về 'fullname' (do model đã concat)
          email: data.email,       // login email
          phone: data.phone,
          // DB mới có thể trả về 'address' (chuỗi full) hoặc 'address_detail'
          address: data.address || data.address_detail || "", 
          // DB trả về 'hire_date'
          hireDate: data.hire_date ? dayjs(data.hire_date).format('DD/MM/YYYY') : 'N/A', 
          dob: data.dob ? dayjs(data.dob) : null,
          department: data.department,
          avatar: data.avatar,
          role: 'Staff', // Hardcode hoặc lấy data.role
          status: 'Active' // Hardcode hoặc data.status
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        message.error("Failed to load profile information");
      } finally {
        setPageLoading(false);
      }
    };

    if (user && user.id) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Gửi dữ liệu lên Backend
      // Backend cần 'fullname' để tách thành first/last name
      const payload = {
          fullname: profile.fullName, 
          phone: profile.phone,
          address: profile.address,
          dob: profile.dob ? toISODate(profile.dob) : null,
          avatar: profile.avatar
      };

      await api.put(`/employee/auth/profile/${user.id}`, payload);
      
      message.success("Profile updated successfully");
      
      // Update context nếu cần
      if(updateUser) {
          updateUser({...user, fullname: profile.fullName, avatar: profile.avatar});
      }

    } catch (error) {
      console.error(error);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div style={{textAlign: 'center', marginTop: 50}}><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.pageTitle}>My Profile</h2>
        
        <div className={styles.card}>
          <div className={styles.cardContent}>
            
            {/* Left: Avatar */}
            <div className={styles.leftColumn}>
              <div className={styles.avatarSection}>
                 <AvatarUpload 
                    avatar={profile.avatar} 
                    setProfile={setProfile} // Truyền setter để cập nhật state sau khi upload
                 />
              </div>
              <Button 
                icon={<LockOutlined />} 
                className={styles.btnChangePassword}
                onClick={() => navigate('/employee/change-password')}
              >
                Change Password
              </Button>
            </div>

            {/* Right: Info Form */}
            <div className={styles.rightColumn}>
              <table className={styles.infoTable}>
                <tbody>
                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Full Name</td>
                    <td className={styles.valueCell}>
                      <Input 
                        value={profile.fullName} 
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      />
                    </td>
                  </tr>
                  
                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Email (Login)</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.email} disabled className={styles.disabledInput} />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Phone</td>
                    <td className={styles.valueCell}>
                      <Input 
                        value={profile.phone} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Address</td>
                    <td className={styles.valueCell}>
                      <Input 
                        value={profile.address} 
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                      />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Date of Birth</td>
                    <td className={styles.valueCell}>
                      <DatePicker 
                        value={profile.dob} 
                        onChange={(date) => setProfile({...profile, dob: date})}
                        format="DD/MM/YYYY"
                        style={{width: '100%'}}
                      />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Department</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.department} disabled className={styles.disabledInput} />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Hire date</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.hireDate} disabled className={styles.disabledInput} />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Role</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.role} disabled className={styles.disabledInput} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button type="primary" loading={loading} className={styles.btnSave} onClick={handleSave}>
            Save Changes
          </Button>
          <Button className={styles.btnCancel} onClick={() => navigate("/employee")}>
            Cancel
          </Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Account;