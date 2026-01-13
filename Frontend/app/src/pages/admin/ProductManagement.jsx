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

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/manager/products");
      
      // SỬA: Map dữ liệu API (New DB) sang cấu trúc Frontend cũ
      const mappedProducts = res.data.map(item => ({
          sku: item.id,            // Backend trả về 'id', Frontend dùng 'sku'
          name: item.name,
          category: item.category, // Backend trả về tên category (đã join)
          price: item.price,
          count: item.stock,       // Backend trả về 'stock', Frontend dùng 'count'
          image: item.images       // Backend trả về 'images'
      }));

      setProducts(mappedProducts);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE
  const handleDeleteClick = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Backend mới endpoint delete nhận ID
      await api.delete(`/manager/products/delete/${selectedProduct.sku}`);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchProducts(); // Reload list
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // ADD / EDIT
  const handleAddProduct = async (data) => {
    // Logic thêm mới (Data từ modal gửi lên)
    try {
        await api.post("/manager/products/add", data);
        setShowAddModal(false);
        fetchProducts();
    } catch (err) {
        console.error(err);
    }
  };

  const handleEditProduct = async (data) => {
      // Logic sửa (Backend cần updateProduct)
      try {
          await api.put("/manager/products/edit", data);
          setShowViewModal(false);
          fetchProducts();
      } catch (err) {
          console.error(err);
      }
  }

  // SEARCH FILTER
  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();
    return (
      product.sku?.toString().toLowerCase().includes(keyword) ||
      product.name?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword)
    );
  });

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  return (
    <>
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="sticky top-0 z-30">
        <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />
      </div>

      <main className="min-h-screen bg-gray-50 p-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
              <p className="text-gray-500 mt-1">Manage your bakery inventory</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d32f2f]/20 focus:border-[#d32f2f] transition-all"
              />
              <button
                onClick={() => {
                    setSelectedProduct(null); // Clear selection for new product
                    setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#d32f2f] text-white font-bold rounded-xl hover:bg-[#b71c1c] shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                      <tr><td colSpan="5" className="text-center py-8">Loading products...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-8">No products found.</td></tr>
                  ) : (
                    filteredProducts.map((product, index) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ManagerFooter />

      {/* Popups */}
      {showDeleteConfirm && <DeleteConfirmation type="product" onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />}
      
      {showDeleteSuccess && <DeleteSuccess type="product" onClose={() => setShowDeleteSuccess(false)} />}

      {/* ADD MODAL */}
      {showAddModal && (
        <AddProductModal
          onSave={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* VIEW/EDIT MODAL */}
      {showViewModal && selectedProduct && (
        <AddProductModal
          initialData={{
              // Map lại đúng key cho modal
              productName: selectedProduct.name,
              price: selectedProduct.price,
              category: selectedProduct.category,
              count: selectedProduct.count,
              sku: selectedProduct.sku,
              status: "selling", // Default hoặc lấy từ API nếu có
              image: selectedProduct.image
          }}
          viewMode={true}
          onSave={handleEditProduct}
          onDelete={handleDeleteClick}
          onCancel={() => setShowViewModal(false)}
        />
      )}
    </>
  );
};

export default ProductManagement;