// src/pages/OrderManagement.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Calendar, theme, message, Radio } from "antd"; // Bỏ Select ở đây nếu không dùng trong table
import api from "../../../lib/axiosEmployee";
import dayjs from "dayjs";
import OrderDetail from "../../../components/employee/OrderDetail/OrderDetail";
import AddOrderModal from "../../../components/employee/AddOrderModal/AddOrderModal";
import "./OrderManagement.css";
import { useAuth } from "../../../context/AuthContext";

// Cấu hình màu sắc cho từng trạng thái
const STATUS_OPTIONS = [
  { value: 'pending', label: 'PENDING', color: 'orange' },
  { value: 'confirmed', label: 'CONFIRMED', color: 'blue' },
  { value: 'shipping', label: 'SHIPPING', color: 'cyan' }, 
  { value: 'completed', label: 'COMPLETED', color: 'green' },
  { value: 'cancelled', label: 'CANCELLED', color: 'red' },
];

const OrderManagement = () => {
  const { token } = theme.useToken();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState([]);
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filterType, setFilterType] = useState('order_date'); 
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.format('YYYY-MM-DD');
      
      const res = await api.post('/employee/order', {
          date: dateStr,
          filterType: filterType
      });
      
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate, filterType]);

  // Handle click on a row -> Open Detail Modal
  const handleRowClick = async (record) => {
    try {
        const res = await api.post('/employee/order/detail', {
            orderId: record.id
        });
        setSelectedOrderDetail(res.data);
        setSelectedOrder(record);
        setIsModalOpen(true);
    } catch (error) {
        message.error("Failed to load order detail");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    fetchOrders(); // Refresh list khi đóng modal đề phòng có thay đổi
  };

  // Handle Status Change (Gọi từ Modal Detail)
  const handleStatusChange = async (orderId, newStatus) => {
      try {
          await api.post('/employee/order/update-status', {
              orderId,
              status: newStatus
          });
          message.success("Status updated successfully");
          
          // Update local list ngay lập tức để giao diện mượt mà
          setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o));
          
          // Update modal data if open
          if(selectedOrder && selectedOrder.id === orderId) {
              setSelectedOrder(prev => ({...prev, status: newStatus}));
          }
      } catch (error) {
          message.error(error.response?.data?.error || "Failed to update status");
      }
  }

  const handleDateSelect = (value) => {
    setSelectedDate(value);
  };

  const handleSaveNewOrder = async (orderPayload) => {
      try {
          await api.post('/employee/order/create', orderPayload);
          message.success("Order created successfully!");
          setIsAddOrderOpen(false);
          fetchOrders(); 
      } catch (error) {
          console.error(error);
          message.error("Failed to create order");
      }
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span style={{fontWeight: 'bold'}}>#{text}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text, record) => text || record.receiver
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (price) => `${Number(price).toLocaleString()} đ`
    },
    {
      title: 'Order Time',
      dataIndex: 'ordertime',
      key: 'ordertime',
      render: (date) => new Date(date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
          // 1. Tìm object màu tương ứng
          const statusObj = STATUS_OPTIONS.find(opt => opt.value === status) || { color: 'default', label: status };
          
          // 2. Render bằng thẻ TAG để hiện màu (Sửa lại chỗ này)
          return (
            <Tag color={statusObj.color} style={{ fontWeight: 'bold' }}>
              {statusObj.label}
            </Tag>
          );
      }
    },
  ];

  return (
    <div className="order-management">
      <div className="page-title-container">
        <div className="page-title">ORDER MANAGEMENT</div>
      </div>

      {/* Header Filters */}
      <div className="order-header">
        <h3 className="order-header-title">Order List - {selectedDate.format('DD/MM/YYYY')}</h3>
        <div className="order-date-tag" style={{backgroundColor: '#FFE4E1', color: '#b71c1c'}}>
            {selectedDate.format('DD MMM')}
        </div>
        
        <div style={{marginLeft: 'auto', display: 'flex', gap: 10}}>
            <Radio.Group value={filterType} onChange={e => setFilterType(e.target.value)} buttonStyle="solid">
                <Radio.Button value="order_date">By Order Date</Radio.Button>
                <Radio.Button value="receive_date">By Receive Date</Radio.Button>
            </Radio.Group>
        </div>
      </div>

      <div className="order-content">
        {/* Main Table */}
        <div className="order-table">
          <Table
            columns={columns}
            dataSource={orders}
            loading={loading}
            rowKey="id"
            pagination={false}
            bordered
            size="middle"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" }
            })}
          />
        </div>

        {/* Right Sidebar */}
         <div className = "right-side-bar">
          <button 
            className= "add-order-button"
            onClick = { () => setIsAddOrderOpen(true)}>
            ADD ORDER
          </button>

          <div
            className="order-calendar"
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <div className="calendar-title">Calendar</div>
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onSelect={handleDateSelect}/>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <OrderDetail
        open={isModalOpen}
        onCancel={handleCloseModal}
        order={selectedOrder}
        detail={selectedOrderDetail}
        onStatusChange={handleStatusChange}
      />

      {/* Add Order Modal */}
      <AddOrderModal
        open={isAddOrderOpen}
        onCancel={() => setIsAddOrderOpen(false)}
        onSave={handleSaveNewOrder}
      />
    </div>
  );
};

export default OrderManagement;