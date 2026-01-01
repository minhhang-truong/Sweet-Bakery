// src/pages/OrderManagement.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Calendar, theme, message, Select } from "antd";
import axios from "axios";
import api from "../../../lib/axiosEmployee";
import dayjs from "dayjs";
import OrderDetail from "../../../components/employee/OrderDetail/OrderDetail";
import AddOrderModal from "../../../components/employee/AddOrderModal/AddOrderModal";
import { generateOrderId } from "../../../lib/orders";
import "./OrderManagement.css";
import { useAuth } from "../../../context/AuthContext";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const STATUS_OPTIONS = [
  { value: 'pending', label: 'PENDING', color: 'orange' },
  { value: 'confirmed', label: 'CONFIRMED', color: 'blue' },
  { value: 'delivering', label: 'DELIVERING', color: 'cyan' },
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
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // 1. Cập nhật state frontend ngay để UX mượt
      const updatedOrders = orders.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      );
      setOrders(updatedOrders);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      // 2. Gọi API backend để lưu status
      await api.post(`/employee/order/update-status`, {
        orderId,
        status: newStatus
      });

      message.success(`Order #${orderId} status changed to ${newStatus.toUpperCase()}`);
    } catch (err) {
      const backendError = err?.response?.data?.error || "Failed to update order status";
      message.error(backendError);
      console.error(err);
      
      // Nếu thất bại → revert lại state
      fetchOrders(selectedDate);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Order Time", dataIndex: "time", key: "time" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        // Bọc div và stopPropagation để khi bấm dropdown không bị mở Modal chi tiết
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            defaultValue={status}
            value={status} // Buộc Select hiển thị giá trị mới nhất từ state
            style={{ width: 140 }}
            onChange={(newVal) => handleStatusChange(record.id, newVal)}
            variant="borderless" // Bỏ viền cho giống thiết kế "Tag" hơn
          >
            {STATUS_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                <Tag color={opt.color} style={{ marginRight: 0 }}>
                  {opt.label}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State quản lý modal thêm mới

  // Hàm xử lý khi bấm Save ở Modal thêm mới
  const handleSaveNewOrder = async (newOrderData) => {
    try {
      newOrderData.employee_id = user.id;
      newOrderData.id = generateOrderId();
      newOrderData.time.slot = newOrderData.time.slot.format("HH:mm");
      newOrderData.time.date = newOrderData.time.date.format("YYYY-MM-DD");

      await api.post(`/employee/order/create`, newOrderData);

      message.success("New order created successfully!");

      setIsAddOrderOpen(false);
      await fetchOrders(selectedDate);

    } catch (err) {
      message.error("Create order failed");
    }
  }

  const fetchOrders = async (date) => {
      try {
        setLoading(true);
        const res = await api.post(`/employee/order`, {
          date: date.format("YYYY-MM-DD"),
        });
        const formattedOrders = res.data.map((order) => ({
          id: order.id,
          customer: order.fullname,
          phone: order.phone,
          receive_phone: order.receive_phone,
          time: order.ordertime.split(".")[0],
          total: `${order.total_amount.toLocaleString()} đ`,
          status: order.status ?? "confirmed",
          receive_date: new Date(order.receive_date).toLocaleDateString(),
          receive_time: order.receive_time,
          address: order.receive_address,
          receiver: order.receiver,
          method: order.payment,
        }));

        setOrders(formattedOrders);
      } catch (err) {
        message.error("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleRowClick = async (record) => {
    try {
      setLoading(true);

      const res = await api.post(
        `/employee/order/detail`,
        { orderId: record.id },
      );

      setSelectedOrderDetail(res.data);
      setSelectedOrder(record);
      setIsModalOpen(true);
    } catch (err) {
      message.error("Failed to load order detail");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="order-management">
      <div className="page-title-container">
        <div className="page-title">ORDER MANAGEMENT</div>
      </div>

      <div className="order-header">
        <h3 className="order-header-title">DAY'S ORDERS</h3>
        <Tag className="order-date-tag" color="#f50">
          {selectedDate.format("MM/DD/YYYY")}
        </Tag>
      </div>

      <div className="order-content">
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
              style: { cursor: "pointer" },
            })}
          />
        </div>

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

      <OrderDetail
        open={isModalOpen}
        onCancel={handleCloseModal}
        order={selectedOrder}
        detail={selectedOrderDetail}
        onStatusChange={handleStatusChange}
      />

      <AddOrderModal
        open={isAddOrderOpen}
        onCancel={() => setIsAddOrderOpen(false)}
        onSave={handleSaveNewOrder}
      />

    </div>
  );
};

export default OrderManagement;
