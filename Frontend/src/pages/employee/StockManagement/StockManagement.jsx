// src/pages/StockManagement.jsx
import { useEffect, useState } from "react";
import { Table, message, Input } from "antd";
import api from "../../../lib/axiosEmployee";
import "./StockManagement.css";

const { Search } = Input;

const StockManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

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
        setFilteredData(formattedData);
      } catch (err) {
        message.error("Failed to load stock data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    const filtered = data.filter(
      (item) =>
        item.sku.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="stock-management">
      <div className="page-title-container">
        <div className="page-title">STOCK MANAGEMENT</div>
      </div>

      {/* Search bar */}
      <div style={{ margin: "10px 0" }}>
        <Search
          placeholder="Search by SKU, Name, or Category"
          allowClear
          value={searchKeyword}
          onChange={handleSearchChange}
          className="stock-search"
        />
      </div>

      <div className="stock-table-wrapper">
        <Table
          columns={columns}
          dataSource={filteredData}
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
