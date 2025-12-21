// src/pages/StockManagement.jsx
import { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import api from "../../../lib/axiosEmployee";
import "./StockManagement.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const StockManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Product SKU", dataIndex: "sku", key: "sku", width: 120 },
    { title: "Product Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    { title: "Count", dataIndex: "count", key: "count" },
  ];

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/employee/stock`);

        const formattedData = res.data.map((item) => ({
          sku: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          count: item.stock,
        }));

        setData(formattedData);
      } catch (err) {
        message.error("Failed to load stock data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  return (
    <div className="stock-management">
      <div className="page-title-container">
        <div className="page-title">STOCK MANAGEMENT</div>
      </div>

      <div className="stock-table-wrapper">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          bordered
          pagination={false}
          rowKey="sku"
        />
      </div>
    </div>
  );
};

export default StockManagement;
