// src/pages/employee/Profile/Profile.jsx
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
  const { user } = useAuth();

  // ---------------- STATE ----------------
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/employee/auth/profile/${user.id}`);
        const data = res.data;

        setProfile({
          id: data.id,
          fullName: data.fullname,
          avatar: data.avatar ?? null,

          phone: data.phone ?? '',
          email: data.email ?? '',
          address: data.address ?? '',
          dateOfBirth: data.dob ?? null,

          loginEmail: data.loginEmail,

          department: data.department,
          hireDate: toISODate(data.hire_date),
          role: "Seller", //data.role
          status: "Working", //data.status,
        });

      } catch (err) {
        message.error('Failed to load profile');
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // ---------------- INPUT HANDLER ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // ---------------- AVATAR UPLOAD ----------------
  

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    try {
      await api.put(`/employee/auth/profile/${user.id}`, {
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        dob: profile.dateOfBirth,
        avatar: profile.avatar
      });

      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Update failed");
    }
  };

  if (pageLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div>
      <Header />

      <div className={styles.container}>
        <div className={styles.pageTitle}>MY PROFILE</div>
        <div className={styles.divider} />

        <div className={styles.profileContent}>
          {/* AVATAR */}
          <div className={styles.avatarSection}>
            <AvatarUpload avatar={profile.avatar} setProfile={setProfile} />
          </div>

          {/* FORM */}
          <div className={styles.formSection}>

            {/* PERSONAL INFORMATION */}
            <div>
              <div className={styles.headerRed}>Personal Information</div>
              <table className={styles.infoTable}>
                <tbody>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>ID</td>
                    <td className={styles.valueCell}>
                      <Input value={user.id} disabled variant='borderless' />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Full name</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.fullName} disabled variant='borderless' />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Date of birth</td>
                    <td className={styles.valueCell}>
                      <DatePicker
                        value={profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null}
                        allowClear={true}
                        placeholder="Select date of birth"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                        onChange={(date) =>
                          setProfile(prev => ({
                            ...prev,
                            dateOfBirth: date ? date.format('YYYY-MM-DD') : null
                          }))
                        }
                      />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Phone number</td>
                    <td className={styles.valueCell}>
                      <Input name="phone" value={profile.phone} onChange={handleInputChange} />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Email</td>
                    <td className={styles.valueCell}>
                      <Input name="email" value={profile.email} onChange={handleInputChange} />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Address</td>
                    <td className={styles.valueCell}>
                      <Input name="address" value={profile.address} onChange={handleInputChange} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* LOGIN INFORMATION */}
            <div>
              <div className={styles.headerGreen}>Login Information</div>
              <table className={styles.infoTable}>
                <tbody>
                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Login email</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.loginEmail} disabled />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Password</td>
                    <td className={styles.valueCell}>
                      <span className={styles.passwordMask}>********</span>
                      <Button
                        type="link"
                        icon={<LockOutlined />}
                        className={styles.changePasswordBtn}
                        onClick={() => navigate('/employee/change-password')}
                      >
                        Change password
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <div>
              <div className={styles.headerGray}>Additional Information</div>
              <table className={styles.infoTable}>
                <tbody>
                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Department</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.department} disabled />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Hire date</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.hireDate} disabled />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Role</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.role} disabled />
                    </td>
                  </tr>

                  <tr className={styles.row}>
                    <td className={styles.labelCell}>Status</td>
                    <td className={styles.valueCell}>
                      <Input value={profile.status} disabled />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button className={styles.btnSave} onClick={handleSave}>Save</Button>
          <Button className={styles.btnCancel} 
            onClick={() => navigate("/employee")}>Cancel</Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Account;