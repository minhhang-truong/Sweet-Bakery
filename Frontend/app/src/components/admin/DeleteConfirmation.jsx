import React from "react";

const DeleteConfirmation = ({ type = "item", onConfirm, onCancel }) => {
  return (
    // 1. CONTAINER CHÍNH: Phủ toàn màn hình với z-index cao nhất (9999) để đè lên tất cả
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* 2. LỚP NỀN TỐI: Làm mờ hậu cảnh, ngăn click xuống dưới */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel} // Click ra ngoài thì đóng
      />

      {/* 3. HỘP THOẠI (MODAL): Căn giữa, kích thước cố định */}
      <div className="relative z-10 w-[90%] max-w-md bg-[#FFEEEE] border-2 border-[#d32f2f] rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Nội dung Text */}
        <h3 className="text-center text-lg font-medium text-gray-800 mb-8 leading-relaxed">
          Are you sure you want to remove this <span className="font-bold">{type}</span>?
        </h3>

        {/* Khu vực nút bấm */}
        <div className="flex justify-center gap-4">
          {/* Nút Hủy */}
          <button
            onClick={onCancel}
            className="min-w-[100px] px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:shadow-md transition-all active:scale-95"
          >
            Quit
          </button>

          {/* Nút Xóa */}
          <button
            onClick={onConfirm}
            className="min-w-[120px] px-4 py-2 bg-[#d32f2f] text-white font-bold rounded-full shadow-md hover:bg-[#b71c1c] hover:shadow-lg transition-all active:scale-95"
          >
            Remove (Delete)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;