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
  { value: 'delivering', label: 'DELIVERING', color: 'cyan' },
  { value: 'completed', label: 'COMPLETED', color: 'green' },
  { value: 'cancelled', label: 'CANCELLED', color: 'red' },
];

const OrderDetail = ({ open, onCancel, order, detail, onStatusChange }) => {
  // Nếu chưa chọn order nào thì không render gì cả
  if (!order) return null;

  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);

  const shippingCost = () => {
    let cost = Number(order.total.replace(/\D/g, ""));
    for (let item of detail) {
      cost = cost - item.price * item.quantity;
    }
    return cost;
  }

  useEffect(() => {
    if (order?.internal_note) {
      setInternalNote(order.internal_note);
    } else {
      setInternalNote("");
    }
  }, [order]);

  const saveInternalNote = async () => {
    try {
      setSaving(true);
      await api.put(`/employee/order/${order.id}/internal-note`, {
        internal_note: internalNote,
      });
      onCancel();
    } catch (err) {
      console.error('Failed to save internal note', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
    >
      <div style={{ padding: '10px' }}>
        {/* Header */}
        <div className={styles.headerContainer}>
          <h2 className={styles.headerTitle}>ORDER ID: {order.id}</h2>
          <Select
            value={order.status}
            onChange={(newVal) => onStatusChange(order.id, newVal)}
            style={{ width: 150 }}
            size="middle"
          >
             {STATUS_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                <Tag color={opt.color}>{opt.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </div>
        <p className={styles.orderTime}>Order time: {order.time}</p>

        <Row gutter={24}>
          {/* CỘT TRÁI: Customer Info */}
          <Col span={10}>
            <div className={styles.tableHeaderRed}>Customer Information</div>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td className={styles.cellBold}>Receiver</td>
                  <td className={styles.cell}>{order.receiver}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Phone number</td>
                  <td className={styles.cell}>{order.receive_phone}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Address</td>
                  <td className={styles.cell}>{order.address}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Receiving date</td>
                  <td className={styles.cell}>{order.receive_date}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Receiving time</td>
                  <td className={styles.cell}>{order.receive_time}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Method</td>
                  <td className={styles.cell}>{order.method}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Note</td>
                  <td className={styles.cell}>{order.note}</td>
                </tr>
              </tbody>
            </table>
          </Col>

          {/* CỘT PHẢI: Order Details */}
          <Col span={14}>
            <div className={styles.tableHeaderYellow}>Order Details</div>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>No.</th>
                  <th className={styles.tableHeaderCell}>Product ID</th>
                  <th className={styles.tableHeaderCell}>Count</th>
                  <th className={styles.tableHeaderCell}>Price</th>
                </tr>
              </thead>
              <tbody>
                {detail?.map((item, index) => (
                  <tr key={item.prod_id}>
                    <td className={styles.cell}>{index + 1}</td>
                    <td className={styles.cell}>{item.prod_id}</td>
                    <td className={styles.cell}>{item.quantity}</td>
                    <td className={styles.cell}>{item.price.toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.shippingRow}>
              <span>Shipping Cost</span>
              <span>{shippingCost()} đ</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{order.total}</span>
            </div>
          </Col>
        </Row>

        {/* Internal Note */}
        <div className={styles.noteContainer}>
          <div className={styles.noteHeader}>Internal Note</div>
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
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" loading={saving} onClick={saveInternalNote}>
            Save Note
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetail;