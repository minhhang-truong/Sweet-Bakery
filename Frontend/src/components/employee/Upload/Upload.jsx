import { Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./Upload.module.css";
import api from "../../../lib/axiosEmployee";
import { useState } from "react";

const AvatarUpload = ({ avatar, setProfile }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isValidType =
      file.type === "image/jpeg" || file.type === "image/png";

    if (!isValidType) {
      message.error("Only JPG/PNG allowed");
      return false;
    }

    if (file.size / 1024 / 1024 > 10) {
      message.error("Image must be smaller than 10MB");
      return false;
    }

    return true;
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      setLoading(true);
      message.loading({ content: "Uploading avatar...", key: "avatar" });

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/employee/upload/avatar", formData);

      const url = res.data.url;

      setProfile((prev) => ({
        ...prev,
        avatar: url,
      }));

      message.success({
        content: "Avatar uploaded successfully 🎉",
        key: "avatar",
      });

      onSuccess(res.data);
    } catch (err) {
      message.error({
        content: "Failed to upload avatar. Please try again ❌",
        key: "avatar",
      });
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
    >
      <div className={styles.avatarWrapper}>
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.uploadBox}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className={styles.uploadText}>Upload</div>
          </div>
        )}
      </div>
    </Upload>
  );
};

export default AvatarUpload;