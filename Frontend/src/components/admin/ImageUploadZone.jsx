import React, { useState, useRef } from "react";
import { Plus, Upload } from "lucide-react";
import api from "../../lib/axiosAdmin";
import { message } from "antd";

const ImageUploadZone = ({
  image,
  onImageUploaded,
  uploadEndpoint,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  /* ================= DRAG EVENTS ================= */

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items?.length) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };

  /* ================= CLICK UPLOAD ================= */

  const handleClick = () => {
    if (!loading) fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = null;
  };

  /* ================= UPLOAD LOGIC ================= */

  const uploadImage = async (file) => {
    // 1️⃣ Validate type
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed (JPG, PNG)");
      return;
    }

    // 2️⃣ Validate size
    if (file.size / 1024 / 1024 > 10) {
      message.warning("Image must be smaller than 10MB");
      return;
    }

    try {
      setLoading(true);
      message.loading({ content: "Uploading image...", key: "upload" });

      const formData = new FormData();
      formData.append("image", file); // must match multer field

      const res = await api.post(`${uploadEndpoint}`, formData);

      message.success({
        content: "Upload successful!",
        key: "upload",
        duration: 2,
      });

      onImageUploaded?.(res.data.url);
    } catch (err) {
      console.error(err);
      message.error({
        content: "Upload failed. Please try again",
        key: "upload",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden flex flex-col items-center justify-center 
        cursor-pointer transition-all duration-200 group rounded-xl
        ${className}
        ${
          isDragging
            ? "border-2 border-[#d32f2f] bg-red-50 scale-[1.02]"
            : "border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#d32f2f]"
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*"
      />

      {/* IMAGE PREVIEW */}
      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
        />
      )}

      {/* OVERLAY WHEN HOVER */}
      {image && !isDragging && (
        <div className="absolute inset-0 bg-black/50 z-20 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-sm font-semibold">
            Click or Drop to Replace
          </span>
        </div>
      )}

      {/* EMPTY / DRAG STATE */}
      {(!image || isDragging) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center">
          {loading ? (
            <span className="text-sm font-semibold text-gray-500">
              Uploading...
            </span>
          ) : (
            <>
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-600">
                Click or Drag Image Here
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG • Max 10MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;