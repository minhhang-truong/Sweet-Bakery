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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/manager/employees");
      
      // SỬA: Map dữ liệu API (New DB) sang cấu trúc Frontend cũ
      const mappedEmps = res.data.map(e => ({
          empId: e.id,            // Backend 'id' -> Frontend 'empId'
          fullName: e.fullname,   // Backend 'fullname' (viết thường) -> Frontend 'fullName'
          email: e.email,
          phone: e.phone,
          department: e.department
      }));

      setEmployees(mappedEmps);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (data) => {
    try {
        await api.post("/manager/employees/add", data);
        setShowAddModal(false);
        fetchEmployees();
    } catch (err) {
        console.error(err);
    }
  };

  const handleEditEmployee = async (data) => {
    try {
        await api.put("/manager/employees/edit", data);
        setShowViewModal(false);
        fetchEmployees();
    } catch (err) {
        console.error(err);
    }
  }

  const handleDeleteClick = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Backend nhận ID trên params
      await api.delete(`/manager/employees/delete/${selectedEmployee.empId}`);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const keyword = searchTerm.toLowerCase();
    return (
      emp.empId?.toString().includes(keyword) ||
      emp.fullName?.toLowerCase().includes(keyword) ||
      emp.email?.toLowerCase().includes(keyword) ||
      emp.department?.toLowerCase().includes(keyword)
    );
  });

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
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
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Human Resource Management</h1>
              <p className="text-gray-500 mt-1">Manage employee information and access</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d32f2f]/20 focus:border-[#d32f2f] transition-all"
              />
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#d32f2f] text-white font-bold rounded-xl hover:bg-[#b71c1c] shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Employee
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Emp ID</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                    {/* <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                       <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                  ) : filteredEmployees.length === 0 ? (
                       <tr><td colSpan="5" className="text-center py-8">No employees found.</td></tr>
                  ) : (
                    filteredEmployees.map((emp, index) => (
                        <tr
                        key={index}
                        onClick={() => handleRowClick(emp)}
                        className="hover:bg-red-50/50 cursor-pointer transition-colors duration-150"
                        >
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium hover:text-[#d32f2f]">{emp.empId}</td>
                        <td className="py-4 px-6 text-sm text-gray-800 font-bold">{emp.fullName}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{emp.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{emp.phone}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{emp.department}</td>
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
      {showDeleteConfirm && (
        <DeleteConfirmation
          type="employee"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDeleteSuccess && (
        <DeleteSuccess type="employee" onClose={() => setShowDeleteSuccess(false)} />
      )}

      {showAddModal && (
        <AddEmployeeModal
          onSave={handleAddEmployee}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showViewModal && selectedEmployee && (
        <AddEmployeeModal
          initialData={{
              // Map lại cho Modal (quan trọng)
              fullName: selectedEmployee.fullName,
              email: selectedEmployee.email,
              phoneNumber: selectedEmployee.phone,
              department: selectedEmployee.department,
              empId: selectedEmployee.empId
          }}
          viewMode={true}
          onSave={handleEditEmployee}
          onDelete={handleDeleteClick}
          onCancel={() => setShowViewModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeManagement;