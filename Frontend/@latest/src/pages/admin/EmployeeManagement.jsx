import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ManagerHeader from "../../components/admin/ManagerHeader.jsx";
import ManagerSidebar from "../../components/admin/ManagerSidebar.jsx";
import ManagerFooter from "../../components/admin/ManagerFooter.jsx";
import AddEmployeeModal from "../../components/admin/AddEmployeeModal.jsx";
import DeleteConfirmation from "../../components/admin/DeleteConfirmation.jsx";
import DeleteSuccess from "../../components/admin/DeleteSuccess.jsx";
import api from "../../lib/axiosAdmin.js";

const EmployeeManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/manager/employees");
      const formattedData = res.data.map((item) => ({
        empId: item.id,
        fullName: item.fullname,
        status: item.status,
        email: item.email,
        phone: item.phone,
        startDate: new Date(item.hire_date).toLocaleDateString(),
      }));
      setEmployees(formattedData);
    } catch (err) {
      message.error("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setShowViewModal(true);
  };

  const handleSaveEmployee = async (data) => {
    try {
      const res = await api.post("/manager/employees/add", data);
      setShowAddModal(false);
      fetchEmployees(); // reload list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmployee = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const id = selectedEmployee.id;
      await api.delete(`/manager/employees`, id);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  if (showAddModal) {
    return (
      <AddEmployeeModal
        onSave={handleSaveEmployee}
        onCancel={() => setShowAddModal(false)}
      />
    );
  }

  if (showViewModal && selectedEmployee) {
    return (
      <AddEmployeeModal
        initialData={selectedEmployee}
        viewMode
        onCancel={() => setShowViewModal(false)}
        onDelete={handleDeleteEmployee}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-primary uppercase mb-2">
          Human Resource
        </h1>
        <h1 className="text-4xl font-bold text-primary uppercase mb-4">
          Management
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary">List of Employee</h2>
            <div className="h-0.5 bg-secondary w-full mt-1" />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            ADD NEW EMPLOYEE <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3 px-4 text-left text-sm font-medium">Full name</th>
                <th className="py-3 px-4 text-left text-sm font-medium">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Phone number</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(emp)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-sm">{emp.fullName}</td>
                  <td className="py-3 px-4 text-sm">{emp.empId}</td>
                  <td className="py-3 px-4 text-sm">{emp.email}</td>
                  <td className="py-3 px-4 text-sm">{emp.phone}</td>
                  <td className="py-3 px-4 text-sm">{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ManagerFooter />

      {showDeleteConfirm && (
        <DeleteConfirmation
          type="employee"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDeleteSuccess && (
        <DeleteSuccess
          type="employee"
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
