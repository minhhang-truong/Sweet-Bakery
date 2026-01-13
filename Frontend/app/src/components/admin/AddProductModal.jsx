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
      status: "selling", // SỬA: "Selling" -> "selling" (chữ thường)
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
      });
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  useEffect(() => {
    if (viewMode && data.sku) {
      fetchProduct();
    }
  }, [viewMode, data.sku]);

  // Handle Input Change
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle Image Upload
  const handleImageUpload = (file) => {
    setData((prev) => ({ ...prev, image: file }));
  };

  const handleSaveAction = () => {
     onSave(data);
  }

  // --- UI RENDER HELPER ---
  const [isEditing, setIsEditing] = useState(!viewMode);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      <div className="relative z-10 w-[90%] max-w-5xl h-[90%] bg-white rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
        <div className="w-[40%] bg-gray-50 p-8 flex flex-col justify-center border-r border-gray-100">
           <div className="aspect-square w-full relative">
             <ImageUploadZone
                image={data.image}
                onImageUploaded={handleImageUpload}
                className="h-full rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-primary transition-colors bg-white"
                readOnly={!isEditing}
             />
           </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="w-[60%] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {viewMode && !isEditing ? "Product Details" : (initialData ? "Edit Product" : "New Product")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {viewMode && !isEditing ? "View product information" : "Fill in the information below"}
              </p>
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
              title="General Information"
              variant="red"
              editable={isEditing}
              data={[
                { label: "Product Name", value: data.productName, key: "productName" },
                { label: "Price", value: data.price, key: "price", type: "number" },
                { label: "Category", value: data.category, key: "category" },
                { label: "Description", value: data.description, key: "description" },
              ]}
              onValueChange={handleChange}
            />

            <InfoTable
              title="Stock & Status"
              variant="green"
              editable={isEditing}
              data={[
                { label: "Count In Stock", value: data.count, key: "count", type: "number" },
                {
                   label: "Status",
                   value: data.status,
                   key: "status",
                   // Nếu muốn dùng select box thì thêm type: "select", options: ["selling", "out_of_stock"]
                },
                { label: "SKU", value: data.sku, key: "sku", readOnly: !!initialData },
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
                <Pencil className="w-4 h-4" /> Edit Product
              </button>
            </>
          ) : (
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

export default AddProductModal;