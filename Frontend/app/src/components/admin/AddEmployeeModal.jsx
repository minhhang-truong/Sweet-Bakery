import { useState, useEffect } from "react";
import { X, Pencil, Save, Trash2, CheckCircle } from "lucide-react"; 
import ImageUploadZone from "./ImageUploadZone.jsx";
import InfoTable from "./InfoTable.jsx";
import api from "../../lib/axiosAdmin.js";

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
      gender: "male", // Mặc định chữ thường
      loginEmail: "",
      password: "",
      role: "",
      status: "active", // SỬA: "working" -> "active"
      avatar: "",
      department: "",
    }
  );

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/manager/employees/details/${data.empId}`);

      setData({
        fullName: res.data.fullname,
        phoneNumber: res.data.phone || "",
        email: res.data.email,
        startDate: res.data.hire_date,
        address: res.data.address || "",
        dob: res.data.dob,
        gender: res.data.gender,
        loginEmail: res.data.loginEmail,
        password: "", 
        role: "Staff",
        status: "active", 
        avatar: res.data.avatar,
        department: res.data.department,
        empId: res.data.id
      });
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  useEffect(() => {
    if (viewMode && data.empId) {
      fetchEmployee();
    }
  }, [viewMode, data.empId]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (file) => {
    setData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSaveAction = () => {
    onSave(data);
  }

  const [isEditing, setIsEditing] = useState(!viewMode);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      <div className="relative z-10 w-[90%] max-w-5xl h-[90%] bg-white rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* CỘT TRÁI: AVATAR */}
        <div className="w-[30%] bg-gray-50 p-8 flex flex-col items-center border-r border-gray-100">
           <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-md border-4 border-white">
             <ImageUploadZone
                image={data.avatar}
                onImageUploaded={handleImageUpload}
                uploadEndpoint="/manager/upload/avatar"
                className="w-full h-full object-cover"
                readOnly={!isEditing}
             />
           </div>
           <h3 className="text-xl font-bold text-gray-800 text-center">{data.fullName || "New Employee"}</h3>
           <p className="text-sm text-gray-500 font-medium">{data.department || "Department"}</p>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="w-[70%] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {viewMode && !isEditing ? "Employee Profile" : (initialData ? "Edit Employee" : "New Employee")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage employee information and access</p>
            </div>
            <button 
              onClick={onCancel} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <InfoTable 
              title="Personal Information" 
              variant="blue" 
              editable={isEditing}
              data={[
                { label: "Full Name", value: data.fullName, key: "fullName" },
                { label: "Date of Birth", value: data.dob, key: "dob", type: "date" },
                { label: "Gender", value: data.gender, key: "gender" },
                { label: "Address", value: data.address, key: "address" },
                { label: "Phone Number", value: data.phoneNumber, key: "phoneNumber" },
                { label: "Personal Email", value: data.email, key: "email" },
              ]}
              onValueChange={handleChange}
            />

            <InfoTable 
              title="Employment Details" 
              variant="gray" 
              editable={isEditing}
              data={[
                { label: "Department", value: data.department, key: "department" },
                { label: "Start Date", value: data.startDate, key: "startDate", type: "date" },
                { label: "Status", value: data.status, key: "status" },
              ]}
              onValueChange={handleChange}
            />

            <InfoTable 
              title="Account Settings" 
              variant="red" 
              editable={isEditing}
              data={[
                { label: "Login Email", value: data.loginEmail, key: "loginEmail" },
                { label: "Password", value: data.password, key: "password", type: "password", placeholder: isEditing && initialData ? "(Unchanged)" : "" },
                { label: "Role", value: "Staff", key: "role", readOnly: true },
              ]}
              onValueChange={handleChange}
            />
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
            {viewMode && !isEditing ? (
            <>
              <button 
                onClick={onDelete} 
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
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
          ) : (
            <>
              <button 
                onClick={() => {
                  if(viewMode) {
                  setIsEditing(false);
                  fetchEmployee();
                  }
                  else onCancel();
                }} 
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              
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
    </div>
  );
};

export default AddEmployeeModal;