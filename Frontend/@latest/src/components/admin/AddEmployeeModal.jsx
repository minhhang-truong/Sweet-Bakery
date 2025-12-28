import { useState, useEffect } from "react";
import { X, Pencil, Save, Trash2, CheckCircle } from "lucide-react"; 
import ImageUploadZone from "./ImageUploadZone.jsx";
import InfoTable from "./InfoTable.jsx";

const AddEmployeeModal = ({
  onSave,
  onCancel,
  initialData,
  viewMode = false,
  onDelete,
}) => {
  const [data, setData] = useState(
    initialData || {
      fullName: "",
      phoneNumber: "",
      email: "",
      startDate: "",
      address: "",  
      dob: "",      
      gender: "Male",
      loginEmail: "",
      password: "",
      id: "",
      role: "Seller",
      status: "working",
      avatar: "",
    }
  );

  const [isEditing, setIsEditing] = useState(!viewMode);
  
  // State cho thông báo Save thành công
  const [showSuccess, setShowSuccess] = useState(false);

// --- XỬ LÝ SAVE ---
  const handleSaveAction = () => {
    // 1. Hiện thông báo thành công
    setShowSuccess(true);

    // 2. Đợi 1 chút để người dùng nhìn thấy thông báo, sau đó mới thực hiện lưu và đóng
    setTimeout(() => {
      onSave(data);       // Gọi hàm lưu của cha
      setIsEditing(false); // Tắt chế độ sửa
      setShowSuccess(false); // Ẩn thông báo
    }, 1000); // 1 giây
  };

  const personalInfo = [
    { label: "Full name", value: data.fullName, key: "fullName" },
    { label: "Gender", value: data.gender, key: "gender" },
    { label: "Date of Birth", value: data.dob, key: "dob" },
    { label: "Phone number", value: data.phoneNumber, key: "phoneNumber" },
    { label: "Email", value: data.email, key: "email" },
    { label: "Address", value: data.address, key: "address" },
    { label: "Start date", value: data.startDate, key: "startDate" },
  ];

  const loginInfo = [
    { label: "Log in email", value: data.loginEmail, key: "loginEmail" },
    { label: "Password", value: data.password, key: "password" },
    { label: "ID", value: data.id, key: "id" },
    { label: "Role", value: data.role, key: "role" },
  ];

  const additionalInfo = [
    { label: "Status", value: data.status, key: "status" },
  ];

  const handleValueChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* OVERLAY */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* --- POP-UP THÔNG BÁO SAVE THÀNH CÔNG (NHỎ) --- */}
      {showSuccess && (
        <div className="absolute z-[60] flex flex-col items-center justify-center bg-white border-2 border-green-500 text-green-700 px-8 py-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-12 h-12 mb-3 text-green-600" />
          <p className="text-lg font-bold">Saved Successfully!</p>
        </div>
      )}

      {/* MAIN MODAL */}
      <div className="relative bg-[#FDFBF0] w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#d32f2f] uppercase">
              {viewMode 
                ? (isEditing ? "Edit Employee Info" : "Employee Details") 
                : "Add New Employee"}
            </h1>
            <div className="h-1 bg-[#d32f2f] w-24 mt-1 rounded-full" />
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-[#d32f2f]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* CỘT TRÁI: ẢNH */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="sticky top-0">
                <p className="font-semibold text-gray-700 mb-2">Profile Image</p>
                {/* Logic: Nếu không phải mode sửa -> Vô hiệu hóa chuột + làm mờ
                   Nếu là mode sửa -> ImageUploadZone sẽ lo việc Drag & Drop
                */}
                <div className={!isEditing ? "pointer-events-none opacity-90 grayscale-[0.1]" : ""}>
                    <ImageUploadZone
                        image={data.image}
                        className="h-64 lg:h-80 shadow-inner bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#d32f2f] transition-colors cursor-pointer"
                        onImageChange={(file) => {
                            const url = URL.createObjectURL(file);
                            setData((prev) => ({ ...prev, image: url }));
                        }}
                    />
                </div>
                {isEditing && (
                    <p className="text-xs text-gray-500 text-center mt-2 italic">
                        * Drag & drop to replace image
                    </p>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: FORM */}
            <div className="flex-1 space-y-6">
              <InfoTable
                title="Personal Information"
                variant="red"
                data={personalInfo}
                editable={isEditing}
                onValueChange={(idx, value) => handleValueChange(personalInfo[idx].key, value)}
              />

              <InfoTable
                title="Log in Information"
                variant="green"
                data={loginInfo}
                editable={isEditing}
                onValueChange={(idx, value) => handleValueChange(loginInfo[idx].key, value)}
              />

              <InfoTable
                title="Additional Information"
                variant="gray"
                data={additionalInfo}
                editable={isEditing}
                onValueChange={(idx, value) => handleValueChange(additionalInfo[idx].key, value)}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-white border-t border-gray-200 shrink-0 flex justify-end gap-3">
          {viewMode && !isEditing && (
            <>
              <button 
                onClick={onDelete} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-[#d32f2f] font-bold rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 px-6 py-2.5 bg-[#d32f2f] text-white font-bold rounded-lg hover:bg-[#b71c1c] shadow-md transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit Information
              </button>
            </>
          )}

          {isEditing && (
            <>
              <button 
                onClick={() => {
                   if(viewMode) setIsEditing(false);
                   else onCancel();
                }} 
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              
              {/* Nút Save gọi handleSaveAction thay vì onSave trực tiếp */}
              <button 
                onClick={handleSaveAction} 
                className="flex items-center gap-2 px-8 py-2.5 bg-[#d32f2f] text-white font-bold rounded-lg hover:bg-[#b71c1c] shadow-lg transition-colors"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddEmployeeModal;