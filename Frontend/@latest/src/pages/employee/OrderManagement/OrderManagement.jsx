// src/pages/OrderManagement.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Calendar, theme, message } from "antd";
import axios from "axios";
import api from "../../../lib/axiosEmployee";
import dayjs from "dayjs";
import OrderDetail from "../../../components/employee/OrderDetail/OrderDetail";
import "./OrderManagement.css";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const OrderManagement = () => {
  const { token } = theme.useToken();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

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
      render: (status) => (
        <Tag color={status === "confirmed" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
  ];

  // Fetch orders from backend
  useEffect(() => {
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
        }));

        setOrders(formattedOrders);
      } catch (err) {
        message.error("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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

      <OrderDetail
        open={isModalOpen}
        onCancel={handleCloseModal}
        order={selectedOrder}
        detail={selectedOrderDetail}
      />
    </div>
  );
};

export default OrderManagement;
