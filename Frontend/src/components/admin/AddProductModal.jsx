import { useState, useEffect } from "react";
import { X, Pencil, Save, Trash2, CheckCircle } from "lucide-react";
import ImageUploadZone from "./ImageUploadZone.jsx";
import InfoTable from "./InfoTable.jsx";
import api from "../../lib/axiosAdmin.js";

const AddProductModal = ({
  onSave,
  onCancel,
  initialData,
  viewMode = false,
  onDelete,
}) => {
  const [data, setData] = useState(
    initialData || {
      productName: "",
      price: 0,
      category: "",
      description: "",
      count: 0,
      status: "Selling",
      sku: "",
      originalPrice: 0,
      image: "",
    }
  );

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/manager/products/details/${data.sku}`);

      setData({
        productName: res.data.name,
        price: Number(res.data.price),
        category: res.data.category,
        description: res.data.description,
        count: Number(res.data.stock),
        status: res.data.status,
        sku: res.data.id,
        originalPrice: res.data.original_price ? res.data.original_price : res.data.price,
        image: res.data.images
          // ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${res.data.image}`
          // : "",
      });
    } catch (err) {
      console.error("Failed to load product", err);
    }
  };

  useEffect(() => {
    if (!initialData) return;

    fetchProduct();
  }, [initialData]);


  const [isEditing, setIsEditing] = useState(!viewMode);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});

  const REQUIRED_FIELDS = [
    "productName",
    "price",
    "category",
    "sku",
    "count",
    "image",
  ];

  const validateRequiredFields = () => {
    const newErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === "" ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAction = async () => {
    setErrors({});

    if (!validateRequiredFields()) return;

    try {
      setShowError(false);

      // gọi save và đợi kết quả
      await onSave(data);
      // thành công
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
        setIsEditing(false);
      }, 1500);

    } catch (err) {
      // thất bại
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const mainInfo = [
    { label: "Product name", value: data.productName, key: "productName" },
    { label: "Price", value: data.price, key: "price" },
    { label: "Category", value: data.category, key: "category", readOnly: viewMode },
    { label: "Description", value: data.description, key: "description" },
  ];

  const stockInfo = [
    { label: "Count", value: data.count, key: "count" },
    { label: "Status", value: data.status, key: "status" },
    { label: "SKU", value: data.sku, key: "sku", readOnly: viewMode },
  ];

  const additionalInfo = [
    { label: "Original Price", value: data.price, key: "originalPrice" },
  ];

  const handleValueChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    // CONTAINER CHÍNH
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* OVERLAY NỀN TỐI */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* --- POP-UP THÔNG BÁO SAVE THÀNH CÔNG --- */}
      {showSuccess && (
        <div className="absolute z-[60] flex flex-col items-center justify-center bg-white border-2 border-green-500 text-green-700 px-8 py-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-12 h-12 mb-3 text-green-600" />
          <p className="text-lg font-bold">Saved Successfully!</p>
        </div>
      )}
      {showError && (
        <div className="absolute z-[60] flex flex-col items-center justify-center bg-white border-2 border-red-500 text-red-700 px-8 py-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
          <X className="w-12 h-12 mb-3 text-red-600" />
          <p className="text-lg font-bold">Update failed!</p>
          <p className="text-sm text-gray-500 mt-1">Please try again</p>
        </div>
      )}


      {/* MODAL BOX */}
      <div className="relative bg-[#FDFBF0] w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#d32f2f] uppercase">
              {viewMode 
                ? (isEditing ? "Edit Product Info" : "Product Details") 
                : "Add New Product"}
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
            
            {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="sticky top-0">
                <p className="font-semibold text-gray-700 mb-2">Product Image</p>
                
                {/* LOGIC DRAG & DROP: 
                    - Nếu !isEditing: Vô hiệu hóa chuột + làm mờ
                    - Nếu isEditing: Cho phép kéo thả
                */}
                <div className={!isEditing ? "pointer-events-none opacity-90 grayscale-[0.1]" : ""}>
                  <ImageUploadZone
                    image={data.image}
                    className="h-64 lg:h-80 shadow-inner bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#d32f2f] transition-colors cursor-pointer"
                    uploadEndpoint="/manager/upload/product"
                    onImageUploaded={(url) => {
                      setData((prev) => ({ ...prev, image: url }));
                    }}
                  />
                </div>

                {/* ❗ ERROR IMAGE HIỂN THỊ Ở ĐÂY */}
                {errors.image && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    {errors.image}
                  </p>
                )}
                
                {/* Text hướng dẫn */}
                {isEditing && (
                    <p className="text-xs text-gray-500 text-center mt-2 italic">
                        * Drag & drop to replace image
                    </p>
                )}
              </div>
            </div>

            {/* --- CỘT PHẢI: FORM THÔNG TIN --- */}
            <div className="flex-1 space-y-6">
              
              <InfoTable 
                title="Main Information" 
                variant="red" 
                data={mainInfo} 
                editable={isEditing}
                errors={errors}
                onValueChange={(idx, v) => handleValueChange(mainInfo[idx].key, v)} 
              />
              
              <InfoTable 
                title="Stock Management" 
                variant="green" 
                data={stockInfo} 
                editable={isEditing}
                errors={errors}
                onValueChange={(idx, v) => handleValueChange(stockInfo[idx].key, v)} 
              />
              
              <InfoTable 
                title="Additional Information" 
                variant="gray" 
                data={additionalInfo} 
                editable={isEditing} 
                onValueChange={(idx, v) => handleValueChange(additionalInfo[idx].key, v)} 
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
                <Pencil className="w-4 h-4" /> Edit Product
              </button>
            </>
          )}

          {isEditing && (
            <>
              <button 
                onClick={() => {
                  if(viewMode) {
                  setIsEditing(false);
                  fetchProduct();
                  }
                  else onCancel();
                }} 
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              
              {/* Nút Save gọi handleSaveAction */}
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

export default AddProductModal;