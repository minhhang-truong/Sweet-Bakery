// src/components/employee/OrderDetail.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Row, Col, Input, Button, Tag, Select } from 'antd';
import styles from './OrderDetail.module.css';
import api from "../../../lib/axiosEmployee";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { value: 'pending', label: 'PENDING', color: 'orange' },
  { value: 'confirmed', label: 'CONFIRMED', color: 'blue' },
  // SỬA: delivering -> shipping
  { value: 'shipping', label: 'SHIPPING', color: 'cyan' }, 
  { value: 'completed', label: 'COMPLETED', color: 'green' },
  { value: 'cancelled', label: 'CANCELLED', color: 'red' },
];

const OrderDetail = ({ open, onCancel, order, detail, onStatusChange }) => {
  // Nếu chưa chọn order nào thì không render gì cả
  if (!order) return null;

  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);

  const shippingCost = () => {
    // Xử lý an toàn nếu total là số hoặc chuỗi
    let totalStr = String(order.total || 0);
    let cost = Number(totalStr.replace(/\D/g, ""));
    
    if (detail && detail.length > 0) {
        for (let item of detail) {
            cost = cost - (item.price * item.quantity);
        }
    }
    return cost;
  }

  useEffect(() => {
    if (order?.employee_note) {
        setInternalNote(order.employee_note);
    } else {
        setInternalNote("");
    }
  }, [order]);

  const saveInternalNote = async () => {
    try {
        setSaving(true);
        await api.put(`/employee/order/${order.id}/internal-note`, {
            internal_note: internalNote
        });
        // Update local state or notify parent if needed
        // Here strictly we should update the order object in parent list, 
        // but for now just close or notify success
        onCancel(); 
    } catch (error) {
        console.error("Failed to save note", error);
    } finally {
        setSaving(false);
    }
  }

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      className={styles.modalCustom}
    >
      <div className={styles.modalContent}>
        {/* Header: Order ID & Status */}
        <div className={styles.headerContainer}>
          <h2 className={styles.headerTitle}>Order ID: #{order.id}</h2>
          
          {/* Dropdown thay đổi trạng thái ngay tại đây */}
          <Select
            value={order.status} // status hiện tại (ví dụ: 'pending', 'shipping'...)
            style={{ width: 160 }}
            onChange={(newVal) => onStatusChange(order.id, newVal)}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className={styles.orderTime}>
          Order Time: {new Date(order.ordertime).toLocaleString('vi-VN')}
        </div>

        <Row gutter={24}>
          {/* CỘT TRÁI: Thông tin khách hàng */}
          <Col span={10}>
            <table className={styles.infoTable}>
              <thead>
                <tr>
                  <th colSpan="2" className={styles.tableHeaderRed}>
                    Customer Information
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.cellBold}>Full Name</td>
                  <td className={styles.cell}>{order.fullname || order.receiver}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Address</td>
                  <td className={styles.cell}>{order.receive_address}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Phone Number</td>
                  <td className={styles.cell}>{order.receive_phone || order.phone}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Note</td>
                  <td className={styles.cell} style={{color: 'red'}}>
                    {order.note || "No note"}
                  </td>
                </tr>
              </tbody>
            </table>

            <br />

            <table className={styles.infoTable}>
              <thead>
                <tr>
                  <th colSpan="2" className={styles.tableHeaderYellow}>
                    Payment & Shipping
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.cellBold}>Receive Time</td>
                  <td className={styles.cell}>
                    {order.receive_time ? new Date(order.receive_time).toLocaleString('vi-VN') : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Payment Method</td>
                  <td className={styles.cell} style={{textTransform: 'capitalize'}}>
                    {order.payment}
                  </td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Shipping Unit</td>
                  <td className={styles.cell}>SweetBakery Express</td>
                </tr>
              </tbody>
            </table>
          </Col>

          {/* CỘT PHẢI: Danh sách món */}
          <Col span={14}>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Product ID</th>
                  <th className={styles.tableHeaderCell}>Quantity</th>
                  <th className={styles.tableHeaderCell}>Price</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((item, idx) => (
                  <tr key={idx}>
                    <td className={styles.cell}>{item.prod_id || item.product_id}</td>
                    <td className={styles.cell}>{item.quantity}</td>
                    <td className={styles.cell}>{Number(item.price).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/*<div className={styles.shippingRow}>
              <span>Shipping Cost</span>
              <span>{shippingCost().toLocaleString()} đ</span>
            </div>*/}
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>
                 {Number(order.total_amount).toLocaleString()} đ
              </span>
            </div>
          </Col>
        </Row>

        {/* Internal Note */}
        <div className={styles.noteContainer}>
          <div className={styles.noteHeader}>Internal Note (Only for Staff)</div>
          <TextArea
            rows={4}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Add internal note for this order..."
            style={{ borderRadius: 0 }}
          />
        </div>

        {/* Footer Buttons */}
        <div style={{ textAlign: 'right', marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Close</Button>
          <Button type="primary" loading={saving} onClick={saveInternalNote} style={{backgroundColor: '#b71c1c'}}>
            Save Note
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetail;