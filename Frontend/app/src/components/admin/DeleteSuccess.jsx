import React, { useEffect } from "react";

const DeleteSuccess = ({ type = "item", onClose }) => {
  // Tự động đóng sau 2 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    // 1. CONTAINER CHÍNH: Phủ toàn màn hình, z-index cực cao
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* 2. LỚP NỀN TỐI */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 3. HỘP THÔNG BÁO: Gọn gàng, không tràn màn hình */}
      <div className="relative z-10 w-[90%] max-w-sm bg-[#E8F5E9] border-2 border-[#d32f2f] rounded-2xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
        
        {/* Nội dung Text */}
        <p className="text-gray-800 text-lg font-medium">
          {/* Viết hoa chữ cái đầu: employee -> Employee */}
          <span className="font-bold capitalize">{type}</span> removed successfully
        </p>

        {/* (Tùy chọn) Nút đóng nhỏ bên dưới nếu người dùng không muốn đợi */}
        <button 
          onClick={onClose}
          className="mt-6 text-sm text-[#d32f2f] hover:underline font-semibold opacity-80 hover:opacity-100"
        >
          Close now
        </button>
      </div>
    </div>
  );
};

export default DeleteSuccess;