import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ManagerHeader from "../../components/admin/ManagerHeader.jsx";
import ManagerSidebar from "../../components/admin/ManagerSidebar.jsx";
import ManagerFooter from "../../components/admin/ManagerFooter.jsx";
import AddProductModal from "../../components/admin/AddProductModal.jsx";
import DeleteConfirmation from "../../components/admin/DeleteConfirmation.jsx";
import DeleteSuccess from "../../components/admin/DeleteSuccess.jsx";
import api from "../../lib/axiosAdmin.js";

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
      setShowAddModal(false);
      fetchProducts(); // reload list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const id = selectedProduct.id;
      await api.delete(`/manager/products/delete`, id);
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
        onSave={() => {}}
        onCancel={() => setShowViewModal(false)}
        initialData={selectedProduct}
        viewMode
        onDelete={handleDeleteProduct}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-primary uppercase mb-4">
          Product Management
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary">Product list</h2>
            <div className="h-0.5 bg-secondary w-full mt-1" />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            ADD NEW <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : error ? (
            <p className="p-4 text-red-500">{error}</p>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3 px-4 text-left text-sm font-medium">Product SKU</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Product name</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Category</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Price</th>
                {/* <th className="py-3 px-4 text-left text-sm font-medium">Count</th> */}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.sku}
                  onClick={() => handleRowClick(product)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-sm">{product.sku}</td>
                  <td className="py-3 px-4 text-sm">{product.name}</td>
                  <td className="py-3 px-4 text-sm">{product.category}</td>
                  <td className="py-3 px-4 text-sm">{product.price.toLocaleString()} đ</td>
                  {/* <td className="py-3 px-4 text-sm">{product.count}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </main>

      <ManagerFooter />

      {showDeleteConfirm && (
        <DeleteConfirmation
          type="product"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDeleteSuccess && (
        <DeleteSuccess
          type="product"
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;
