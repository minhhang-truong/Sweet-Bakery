// src/pages/OrderManagement.jsx
import React from 'react';
import { Table, Tag, Calendar, theme } from 'antd';

const OrderManagement = () => {
  const { token } = theme.useToken();

  // Dữ liệu giả cho bảng
  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Order Time', dataIndex: 'time', key: 'time' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Tag color="green">Confirmed</Tag> },
  ];

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      id: `#ORD00${i}`,
      customer: 'Nguyen Van A',
      phone: '0912345678',
      time: '12:30 12/10/25',
      total: '150,000 đ',
      status: 'confirmed',
    });
  }

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
        {/* Phần Bảng (Chiếm phần lớn) */}
        <div style={{ flex: 1, minWidth: '600px' }}>
           <Table columns={columns} dataSource={data} pagination={false} bordered size="middle" />
        </div>

        {/* Phần Lịch (Bên phải) */}
        <div style={wrapperStyle}>
          <div style={{textAlign: 'center', marginBottom: 10, fontWeight: 'bold'}}>Calendar</div>
          <Calendar fullscreen={false} />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;