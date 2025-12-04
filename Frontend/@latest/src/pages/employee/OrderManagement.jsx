// src/pages/OrderManagement.jsx
import React, { useState } from 'react';
import { Table, Tag, Calendar, theme } from 'antd';
// Import Component con vừa tạo
import OrderDetail from '../../components/employee/OrderDetail/OrderDetail';

const OrderManagement = () => {
  const { token } = theme.useToken();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Order Time', dataIndex: 'time', key: 'time' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Tag color="green">Confirmed</Tag> },
  ];

  // Dữ liệu giả
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      id: `#ORD00${i}`,
      customer: 'Nguyen Van A',
      phone: '0912345678',
      time: '12:30 12/10/25',
      total: '1,000,000 đ',
      status: 'confirmed',
      address: 'In-store / Home Address',
      note: 'Keep the cake fresh, no need candles'
    });
  }

  const handleRowClick = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: 10,
    backgroundColor: 'white'
  };

  return (
    <div>
      <div className="page-title-container">
        <div className="page-title">ORDER MANAGEMENT</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 10 }}>
         <h3 style={{ color: '#b71c1c', margin: 0 }}>TODAY'S ORDERS</h3>
         <Tag color="#f50" style={{ borderRadius: 20, padding: '2px 10px' }}>12/10/2025</Tag>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '600px' }}>
           <Table 
             columns={columns} 
             dataSource={data} 
             pagination={false} 
             bordered 
             size="middle" 
             onRow={(record) => ({
               onClick: () => handleRowClick(record),
               style: { cursor: 'pointer' } 
             })}
           />
        </div>

        <div style={wrapperStyle}>
          <div style={{textAlign: 'center', marginBottom: 10, fontWeight: 'bold'}}>Calendar</div>
          <Calendar fullscreen={false} />
        </div>
      </div>

      {/* --- GỌI COMPONENT CON Ở ĐÂY --- */}
      <OrderDetail 
        open={isModalOpen} 
        onCancel={handleCloseModal} 
        order={selectedOrder} 
      />
      
    </div>
  );
};

export default OrderManagement;