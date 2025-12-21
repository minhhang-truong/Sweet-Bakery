import { useState } from "react";
import ImageUploadZone from "./ImageUploadZone.jsx";
import InfoTable from "./InfoTable.jsx";

const AddProductModal = ({
  onSave,
  onCancel,
  initialData,
  viewMode = false,
  onDelete,
}) => {
  const [data, setData] = useState(
    initialData || {
      name: "",
      price: "",
      category: "",
      description: "",
      count: "",
      status: "Selling",
      sku: "",
      originalPrice: "",
    }
  );

  const mainInfo = [
    { label: "Product name", value: data.name },
    { label: "Price", value: `${data.price} đ` },
    { label: "Category", value: data.category },
    { label: "Description", value: data.description },
  ];

  const stockInfo = [
    { label: "Count", value: data.count },
    { label: "Status", value: data.status },
    { label: "SKU", value: data.sku },
  ];

  const additionalInfo = [
    { label: "Original Price", value: data.originalPrice },
  ];

  const handleValueChange = (section, index, value) => {
    const fieldMaps = {
      main: ["productName", "price", "category", "description"],
      stock: ["count", "status", "sku"],
      additional: ["originalPrice"],
    };
    const field = fieldMaps[section][index];
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-card min-h-screen p-8">
      <h1 className="text-xl font-semibold text-primary mb-2">Product images</h1>
      <div className="h-1 bg-primary w-full max-w-md mb-8" />

      <div className="flex gap-8 flex-wrap">
        <div className="w-full max-w-md">
          <ImageUploadZone
            image={data.image}
            className="h-72"
            onImageChange={(file) => {
              const url = URL.createObjectURL(file);
              setData((prev) => ({ ...prev, image: url }));
            }}
          />
        </div>

        <div className="flex-1 min-w-[400px] space-y-4">
          <InfoTable title="Main Information" variant="red" data={mainInfo} editable={!viewMode} onValueChange={(i, v) => handleValueChange("main", i, v)} />
          <InfoTable title="Stock Management" variant="green" data={stockInfo} editable={!viewMode} onValueChange={(i, v) => handleValueChange("stock", i, v)} />
          <InfoTable title="Additional Information" variant="gray" data={additionalInfo} editable={!viewMode} onValueChange={(i, v) => handleValueChange("additional", i, v)} />
        </div>
      </div>

      <div className="h-px bg-primary my-8" />
      <div className="flex justify-center gap-4">
        {viewMode ? (
          <button onClick={onDelete} className="btn-cancel">Remove (Delete) Product</button>
        ) : (
          <>
            <button onClick={() => onSave(data)} className="btn-save">Save</button>
            <button onClick={onCancel} className="btn-cancel">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
