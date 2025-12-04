// src/components/employee/OrderDetail.jsx
import React from 'react';
import { Modal, Row, Col, Input, Button, Tag } from 'antd';
import styles from './OrderDetail.module.css';

const { TextArea } = Input;

const OrderDetail = ({ open, onCancel, order }) => {
  // Nếu chưa chọn order nào thì không render gì cả
  if (!order) return null;

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
          <Tag color="blue" className={styles.statusTag}>Confirmed</Tag>
        </div>
        <p className={styles.orderTime}>Order time: {order.time}</p>

        <Row gutter={24}>
          {/* CỘT TRÁI: Customer Info */}
          <Col span={10}>
            <div className={styles.tableHeaderRed}>Customer Information</div>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td className={styles.cellBold}>Full name</td>
                  <td className={styles.cell}>{order.customer}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Phone number</td>
                  <td className={styles.cell}>{order.phone}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Address</td>
                  <td className={styles.cell}>{order.address}</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Receiving date</td>
                  <td className={styles.cell}>12/10/2025</td>
                </tr>
                <tr>
                  <td className={styles.cellBold}>Receiving time</td>
                  <td className={styles.cell}>5pm - 5h30pm</td>
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
                {/* Mock data sản phẩm */}
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td className={styles.cell}>{item}</td>
                    <td className={styles.cell}>E634KT</td>
                    <td className={styles.cell}>{item === 2 ? 2 : 1}</td>
                    <td className={styles.cell}>{item === 5 ? '599.000 đ' : '299.000 đ'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.shippingRow}>
              <span>Shipping Cost</span>
              <span>30.000 đ</span>
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
          <TextArea rows={4} style={{ borderRadius: 0 }} />
        </div>

        {/* Footer Buttons */}
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button type="primary" danger onClick={onCancel}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetail;