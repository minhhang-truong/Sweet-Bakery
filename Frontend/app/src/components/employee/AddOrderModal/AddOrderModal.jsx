import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Input, Button, DatePicker, TimePicker, InputNumber, Select, message, List, Avatar } from 'antd';
import dayjs from 'dayjs';
import styles from '../OrderDetail/OrderDetail.module.css'; 
import api from '../../../lib/axiosEmployee';

const { TextArea } = Input;
const { Option } = Select;

const AddOrderModal = ({ open, onCancel, onSave }) => {
  // --- STATE QUẢN LÝ FORM ---
  const [customerInfo, setCustomerInfo] = useState({
    receiver: {
      name: '',
      phone: '',
      address: '',
    },
    note: ''
  });

  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Mặc định chữ thường
  const [deliveryDate, setDeliveryDate] = useState(dayjs());
  const [deliveryTime, setDeliveryTime] = useState(dayjs());
  
  // State cho tìm kiếm sản phẩm
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]); // List sản phẩm từ API
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Lấy danh sách sản phẩm khi mở modal
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if(!searchKeyword.trim()){
        setFilteredProducts(products);
    } else {
        const lower = searchKeyword.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(lower) || p.id.toLowerCase().includes(lower));
        setFilteredProducts(filtered);
    }
  }, [searchKeyword, products]);

  const fetchProducts = async () => {
      try {
          // Gọi API lấy menu (API này không cần auth hoặc quyền staff)
          const res = await api.get('/employee/menu'); 
          setProducts(res.data);
          setFilteredProducts(res.data);
      } catch (error) {
          console.error("Failed to fetch products", error);
          message.error("Failed to load product list");
      }
  }

  // --- HÀM HELPER TẠO ID ĐÚNG CHUẨN DB MỚI ---
  const generateOrderId = () => {
    const numbers = "0123456789";
    let res = "ORD"; 
    for(let i = 0; i < 9; i++){
        res += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return res; // Ví dụ: ORD123456789
  };

  const handleAddProductToCart = (product) => {
      const existing = items.find(i => i.id === product.id);
      if(existing){
          setItems(items.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i));
      } else {
          setItems([...items, { ...product, qty: 1 }]);
      }
      message.success(`Added ${product.name}`);
  }

  const handleRemoveItem = (id) => {
      setItems(items.filter(i => i.id !== id));
  }

  const updateQty = (id, val) => {
      setItems(items.map(i => i.id === id ? {...i, qty: val} : i));
  }

  const calculateTotal = () => {
      return items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  const handleSave = async () => {
    // Validate cơ bản
    if (!customerInfo.receiver.name || !customerInfo.receiver.phone) {
      return message.error('Please enter receiver name and phone');
    }
    if (items.length === 0) {
      return message.error('Please add at least one product');
    }

    // Giả lập Customer ID (Nếu hệ thống có chọn khách hàng thì lấy ID thật)
    // Nếu là khách vãng lai, backend cần xử lý. Ở đây tạm gửi 0 hoặc ID khách vãng lai mặc định
    // Lưu ý: DB bắt buộc customer_id. Bạn nên có logic chọn User hoặc tạo User nhanh.
    // Tạm thời mình để cus_id là null để backend xử lý (nếu backend cho phép) hoặc bạn phải fix cứng 1 ID khách vãng lai trong DB.
    // Tuy nhiên, theo model bạn gửi, cus_id là bắt buộc. 
    // GỢI Ý: Hãy tạo sẵn 1 user "Walk-in Guest" trong DB và lấy ID đó điền vào đây.
    const WALK_IN_GUEST_ID = 1; // Ví dụ ID 1 là khách vãng lai

    const payload = {
      id: generateOrderId(), // QUAN TRỌNG: ID đúng format
      cus_id: WALK_IN_GUEST_ID, // Cần ID khách hàng hợp lệ
      prices: {
          total: calculateTotal()
      },
      payment: paymentMethod.toLowerCase(), // 'cash', 'bank'...
      time: {
          slot: deliveryTime.format('HH:mm'),
          date: deliveryDate.format('YYYY-MM-DD')
      },
      customer: {
          note: customerInfo.note
      },
      address: customerInfo.receiver.address || "Tại cửa hàng",
      receiver: {
          name: customerInfo.receiver.name,
          phone: customerInfo.receiver.phone
      },
      status: 'pending', // Chữ thường
      items: items.map(i => ({
          id: i.id,
          qty: i.qty,
          price: i.price
      }))
    };

    try {
        await onSave(payload); // Gọi hàm save từ props (thường là gọi API createOrder)
        // Reset form
        setItems([]);
        setCustomerInfo({ receiver: { name: '', phone: '', address: ''}, note: '' });
        setIsProductPickerOpen(false);
    } catch (error) {
        console.error(error);
        // message error đã được handle ở parent hoặc axios interceptor
    }
  };

  return (
    <>
      <Modal
        title={<div className={styles.headerTitle} style={{fontSize: 20}}>Create New Order</div>}
        open={open}
        onCancel={onCancel}
        width={900}
        footer={null}
        style={{ top: 20 }}
      >
        <div className={styles.modalContent}>
          {/* --- CỘT TRÁI: THÔNG TIN KHÁCH & SẢN PHẨM --- */}
          <Row gutter={24}>
            <Col span={14} style={{ borderRight: '1px solid #f0f0f0' }}>
              <h3 style={{color: '#b71c1c', marginBottom: 15}}>Customer Information</h3>
              <Row gutter={16}>
                  <Col span={12}>
                      <Input 
                        placeholder="Receiver Name" 
                        value={customerInfo.receiver.name}
                        onChange={e => setCustomerInfo({...customerInfo, receiver: {...customerInfo.receiver, name: e.target.value}})}
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={12}>
                      <Input 
                        placeholder="Phone Number" 
                        value={customerInfo.receiver.phone}
                        onChange={e => setCustomerInfo({...customerInfo, receiver: {...customerInfo.receiver, phone: e.target.value}})}
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={24}>
                      <Input 
                        placeholder="Address (Leave empty if eat-in)" 
                        value={customerInfo.receiver.address}
                        onChange={e => setCustomerInfo({...customerInfo, receiver: {...customerInfo.receiver, address: e.target.value}})}
                        style={{marginBottom: 10}}
                      />
                  </Col>
              </Row>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
                  <h3 style={{color: '#b71c1c', margin: 0}}>Order Items</h3>
                  <Button type="dashed" onClick={() => setIsProductPickerOpen(true)}>+ Add Product</Button>
              </div>

              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="text" danger onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                        ]}
                    >
                        <List.Item.Meta
                        avatar={<Avatar src={item.image} shape="square" size="large" />}
                        title={item.name}
                        description={
                            <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                <span>{item.price.toLocaleString()} đ</span>
                                <InputNumber min={1} value={item.qty} onChange={(val) => updateQty(item.id, val)} size="small" />
                            </div>
                        }
                        />
                        <div>{(item.price * item.qty).toLocaleString()} đ</div>
                    </List.Item>
                    )}
                />
                {items.length === 0 && <div style={{textAlign: 'center', color: '#999', padding: 20}}>No items added</div>}
              </div>
            </Col>

            {/* --- CỘT PHẢI: THANH TOÁN & TỔNG --- */}
            <Col span={10}>
               <h3 style={{color: '#b71c1c', marginBottom: 15}}>Payment & Delivery</h3>
               
               <div style={{marginBottom: 15}}>
                   <label style={{fontWeight: 'bold', display: 'block', marginBottom: 5}}>Payment Method</label>
                   <Select 
                    value={paymentMethod} 
                    onChange={setPaymentMethod} 
                    style={{width: '100%'}}
                   >
                       <Option value="cash">Cash</Option>
                       <Option value="bank">Bank Transfer</Option>
                       <Option value="momo">Momo</Option>
                       <Option value="card">Credit Card</Option>
                   </Select>
               </div>

               <div style={{marginBottom: 15}}>
                   <label style={{fontWeight: 'bold', display: 'block', marginBottom: 5}}>Receive Time</label>
                   <div style={{display: 'flex', gap: 10}}>
                       <DatePicker value={deliveryDate} onChange={setDeliveryDate} format="DD/MM/YYYY" style={{flex: 1}} />
                       <TimePicker value={deliveryTime} onChange={setDeliveryTime} format="HH:mm" style={{flex: 1}} />
                   </div>
               </div>

               <div style={{marginBottom: 20}}>
                   <label style={{fontWeight: 'bold', display: 'block', marginBottom: 5}}>Note</label>
                   <TextArea 
                    rows={3} 
                    value={customerInfo.note}
                    onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})}
                   />
               </div>

               <div style={{backgroundColor: '#fff7e6', padding: 15, borderRadius: 8}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                       <span>Subtotal:</span>
                       <span>{calculateTotal().toLocaleString()} đ</span>
                   </div>
                   <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                       <span>Shipping:</span>
                       <span>0 đ</span>
                   </div>
                   <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16, color: '#b71c1c', borderTop: '1px dashed #ccc', paddingTop: 10}}>
                       <span>Total:</span>
                       <span>{calculateTotal().toLocaleString()} đ</span>
                   </div>
               </div>
            </Col>
          </Row>

          {/* Footer Buttons */}
          <div style={{ textAlign: 'right', marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button onClick={onCancel}>Close</Button>
            <Button type="primary" onClick={handleSave} style={{backgroundColor: '#b71c1c'}}>Save Order</Button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL CON: CHỌN BÁNH --- */}
      <Modal
        title="Select Product"
        open={isProductPickerOpen}
        onCancel={() => setIsProductPickerOpen(false)}
        footer={null}
      >
        <Input.Search
            placeholder="Search by product name"
            allowClear
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ marginBottom: 12 }}
        />

        <div style={{height: 400, overflowY: 'auto'}}>
            <List
            itemLayout="horizontal"
            dataSource={filteredProducts}
            locale={{ emptyText: "No products found" }}
            renderItem={(item) => (
                <List.Item
                actions={[<Button type="primary" size="small" onClick={() => handleAddProductToCart(item)}>Add</Button>]}
                >
                <List.Item.Meta
                    avatar={<Avatar src={item.image || item.images} />}
                    title={item.name}
                    description={`Price: ${Number(item.price).toLocaleString()} đ | Stock: ${item.stock || item.count}`}
                />
                </List.Item>
            )}
            />
        </div>
      </Modal>
    </>
  );
};

export default AddOrderModal;