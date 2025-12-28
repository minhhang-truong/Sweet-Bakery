import React, { useState, useRef } from "react";
import { Plus, Upload, Image as ImageIcon } from "lucide-react";

const ImageUploadZone = ({ image, onImageChange, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0); // Dùng counter để fix lỗi nhấp nháy khi kéo qua các phần tử con

  // 1. Xử lý khi kéo file vào
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  // 2. Xử lý khi kéo file ra
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 3. Xử lý khi thả file (DROP)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  // 4. Click chọn file
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
    // Reset value để có thể chọn lại cùng 1 file nếu muốn
    e.target.value = null;
  };

  const validateAndUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, GIF, etc.)");
      return;
    }
    if (onImageChange) {
      onImageChange(file);
    }
  };

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
        ${isDragging 
          ? "border-2 border-solid border-[#d32f2f] bg-red-50 scale-[1.02]" 
          : "border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#d32f2f] hover:bg-gray-100"
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

      {/* --- LAYER 1: HIỂN THỊ ẢNH CŨ (Luôn hiển thị nếu có) --- */}
      {image && (
        <img
          src={image}
          alt="Uploaded content"
          className="absolute inset-0 w-full h-full object-cover rounded-xl z-10 pointer-events-none" 
        />
      )}

      {/* --- LAYER 2: OVERLAY GỢI Ý THAY THẾ (Hiện khi Hover) --- */}
      {image && !isDragging && (
        <div className="absolute inset-0 bg-black/50 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-xl pointer-events-none">
          <Upload className="w-8 h-8 mb-2" />
          <span className="font-semibold text-sm">Click or Drop to Replace</span>
        </div>
      )}

      {/* --- LAYER 3: GIAO DIỆN KÉO THẢ (Hiện khi Drag hoặc chưa có ảnh) --- */}
      {(!image || isDragging) && (
        // z-index cao nhất (30) để đè lên ảnh cũ
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none ${image ? "bg-white/80 backdrop-blur-sm" : ""}`}>
          {isDragging ? (
            <>
              <Upload className="w-12 h-12 text-[#d32f2f] mb-3 animate-bounce" />
              <p className="text-[#d32f2f] font-bold text-lg">Drop to Replace!</p>
            </>
          ) : (
            // Chỉ hiện khi chưa có ảnh
            !image && (
              <>
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 border border-gray-100">
                   <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-600 px-4">
                  Insert/Drag/Drop your file here!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPG, PNG, JPEG
                </p>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;