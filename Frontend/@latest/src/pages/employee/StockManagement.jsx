// src/pages/StockManagement.jsx
import React from 'react';
import { Table } from 'antd';

const StockManagement = () => {
  const columns = [
    { title: 'Product SKU', dataIndex: 'sku', key: 'sku', width: 100 },
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' }, // Dữ liệu mẫu trong ảnh bạn gửi có cột Phone hơi lạ cho kho, nhưng mình cứ để theo ảnh
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
  ];

  const data = [];
  for (let i = 0; i < 15; i++) {
    data.push({
      key: i,
      sku: `PROD00${i}`,
      name: `Cake ${i}`,
      category: 'Birthday Cake',
      phone: '0912345678',
      price: '150,000 đ',
      count: '1000',
    });
  }

  return (
    <div>
      <div className="page-title-container">
        <div className="page-title">STOCK MANAGEMENT</div>
      </div>
      
      <div style={{ marginTop: 20 }}>
        <Table columns={columns} dataSource={data} bordered pagination={false} />
      </div>
    </div>
  );
};

export default StockManagement;