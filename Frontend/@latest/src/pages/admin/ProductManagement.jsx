import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ManagerHeader from "../../components/admin/ManagerHeader.jsx";
import ManagerSidebar from "../../components/admin/ManagerSidebar.jsx";
import ManagerFooter from "../../components/admin/ManagerFooter.jsx";
import AddProductModal from "../../components/admin/AddProductModal.jsx";
import DeleteConfirmation from "../../components/admin/DeleteConfirmation.jsx";
import DeleteSuccess from "../../components/admin/DeleteSuccess.jsx";
import api from "../../lib/axiosAdmin.js";

const ProductManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();

    return (
      product.sku?.toString().toLowerCase().includes(keyword) ||
      product.name?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword)
    );
  });


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/manager/products`);
      const formattedData = res.data.map((item) => ({
          sku: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          count: item.stock,
          description: item.description,
        }));
      setProducts(formattedData);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleSaveProduct = async (data) => {
    try {
      await api.post(`/manager/products/add`, data);
      fetchProducts(); // reload list
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleEditProduct = async (data) => {
    try {
      await api.put(`/manager/products/edit`, data);
      fetchProducts();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const handleDeleteProduct = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/manager/products/delete/${selectedProduct.sku}`);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (showAddModal) {
    return (
      <AddProductModal
        onSave={handleSaveProduct}
        onCancel={() => setShowAddModal(false)}
      />
    );
  }

  if (showViewModal && selectedProduct) {
    return (
      <AddProductModal
        onSave={handleEditProduct}
        onCancel={() => setShowViewModal(false)}
        initialData={selectedProduct}
        viewMode
        onDelete={handleDeleteProduct}
      />
    );
  }

  return (
    // 1. SỬA LAYOUT: Dùng min-h-screen để trang có thể dài hơn màn hình (scroll tự nhiên của trình duyệt)
    <div className="flex flex-col min-h-screen bg-[#FDFBF0]">
      
      {/* Sidebar (Overlay - Không ảnh hưởng layout chính) */}
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header (Sticky để luôn bám trên cùng khi cuộn trang) */}
      <div className="sticky top-0 z-30">
        <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />
      </div>

      {/* 2. MAIN CONTENT: flex-1 để đẩy Footer xuống đáy nếu nội dung ngắn */}
      <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
        
        {/* Title Area */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#d32f2f] uppercase mb-6 font-sans tracking-wide">
            Product Management
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-[#b99f56] pb-2">
            <h2 className="text-xl font-bold text-[#b99f56] uppercase">
              Product list
            </h2>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center gap-2 bg-[#d32f2f] text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#b71c1c] transition-all duration-200"
            >
              ADD NEW <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by SKU, name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-4 py-2.5 rounded-lg border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#d32f2f]/50
                      focus:border-[#d32f2f] text-sm shadow-sm"
          />
        </div>


        {/* Table Area */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">Product SKU</th>
                  <th className="py-4 px-6 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">Product name</th>
                  <th className="py-4 px-6 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(product)}
                    className="hover:bg-red-50/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium hover:text-[#d32f2f]">{product.sku}</td>
                    <td className="py-4 px-6 text-sm text-gray-800 font-bold">{product.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4 px-6 text-sm text-[#d32f2f] font-bold">{Number(product.price).toLocaleString("vi-VN") + " đ"}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. FOOTER: Nằm cuối cùng trong dòng chảy (Flow) */}
      {/* Nó sẽ tự động bị đẩy xuống dưới cùng, phải cuộn hết trang mới thấy */}
      <ManagerFooter />

      {/* Popups */}
      {showDeleteConfirm && <DeleteConfirmation type="product" onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />}
      {showDeleteSuccess && <DeleteSuccess type="product" onClose={() => setShowDeleteSuccess(false)} />}
    </div>
  );
};

export default ProductManagement;