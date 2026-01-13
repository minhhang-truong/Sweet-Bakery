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
      // Tách địa chỉ thành 4 phần
      street: '',
      ward: '',
      district: '',
      city: ''
    },
    note: ''
  });

  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [deliveryDate, setDeliveryDate] = useState(dayjs());
  const [deliveryTime, setDeliveryTime] = useState(dayjs());
  
  // State cho tìm kiếm sản phẩm
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);

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
          const res = await api.get('/employee/menu'); 
          setProducts(res.data);
          setFilteredProducts(res.data);
      } catch (error) {
          console.error("Failed to fetch products", error);
      }
  }

  const generateOrderId = () => {
    const numbers = "0123456789";
    let res = "ORD"; 
    for(let i = 0; i < 9; i++){
        res += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return res;
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
    // Validate
    const { name, phone, street, ward, district, city } = customerInfo.receiver;
    if (!name || !phone) return message.error('Receiver name and phone are required');
    if (!street || !ward || !district || !city) return message.error('Full address is required');
    if (items.length === 0) return message.error('Please add at least one product');

    // Lưu ý: Database yêu cầu customer_id. Bạn phải đảm bảo ID này tồn tại.
    // Tốt nhất nên tạo sẵn 1 user với ID=1 làm "Guest Customer" trong DB
    const WALK_IN_GUEST_ID = 1; 

    const payload = {
      id: generateOrderId(),
      cus_id: WALK_IN_GUEST_ID, 
      prices: {
          total: calculateTotal()
      },
      payment: paymentMethod.toLowerCase(),
      time: {
          slot: deliveryTime.format('HH:mm'),
          date: deliveryDate.format('YYYY-MM-DD')
      },
      customer: {
          note: customerInfo.note
      },
      // Gửi object address đầy đủ 4 trường
      address: {
          street: street,
          ward: ward,
          district: district,
          city: city
      },
      receiver: {
          name: name,
          phone: phone
      },
      status: 'confirmed', // Đơn tạo bởi nhân viên thường là đã xác nhận luôn
      items: items.map(i => ({
          id: i.id,
          qty: i.qty,
          price: i.price
      }))
    };

    try {
        await onSave(payload);
        // Reset form
        setItems([]);
        setCustomerInfo({ 
            receiver: { name: '', phone: '', street: '', ward: '', district: '', city: ''}, 
            note: '' 
        });
        setIsProductPickerOpen(false);
    } catch (error) {
        console.error(error);
    }
  };

  const updateReceiver = (field, value) => {
      setCustomerInfo(prev => ({
          ...prev,
          receiver: { ...prev.receiver, [field]: value }
      }));
  }

  return (
    <>
      <Modal
        title={<div className={styles.headerTitle} style={{fontSize: 20}}>Create New Order</div>}
        open={open}
        onCancel={onCancel}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <div className={styles.modalContent}>
          <Row gutter={24}>
            {/* --- CỘT TRÁI --- */}
            <Col span={14} style={{ borderRight: '1px solid #f0f0f0' }}>
              <h3 style={{color: '#b71c1c', marginBottom: 15}}>Customer Information</h3>
              <Row gutter={10}>
                  <Col span={12}>
                      <Input 
                        placeholder="Receiver Name" 
                        value={customerInfo.receiver.name}
                        onChange={e => updateReceiver('name', e.target.value)}
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={12}>
                      <Input 
                        placeholder="Phone Number" 
                        value={customerInfo.receiver.phone}
                        onChange={e => updateReceiver('phone', e.target.value)}
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  
                  {/* 4 Ô Nhập Địa Chỉ */}
                  <Col span={8}>
                      <Input 
                        placeholder="City" 
                        value={customerInfo.receiver.city} 
                        onChange={e => updateReceiver('city', e.target.value)} 
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={8}>
                      <Input 
                        placeholder="District" 
                        value={customerInfo.receiver.district} 
                        onChange={e => updateReceiver('district', e.target.value)} 
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={8}>
                      <Input 
                        placeholder="Ward" 
                        value={customerInfo.receiver.ward} 
                        onChange={e => updateReceiver('ward', e.target.value)} 
                        style={{marginBottom: 10}}
                      />
                  </Col>
                  <Col span={24}>
                      <Input 
                        placeholder="Street / House No." 
                        value={customerInfo.receiver.street} 
                        onChange={e => updateReceiver('street', e.target.value)} 
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
                    <List.Item actions={[<Button type="text" danger onClick={() => handleRemoveItem(item.id)}>Remove</Button>]}>
                        <List.Item.Meta
                        avatar={<Avatar src={item.image} shape="square" size="large" />}
                        title={item.name}
                        description={
                            <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                <span>{Number(item.price).toLocaleString()} đ</span>
                                <InputNumber min={1} value={item.qty} onChange={(val) => updateQty(item.id, val)} size="small" />
                            </div>
                        }
                        />
                        <div style={{fontWeight: 'bold'}}>{(item.price * item.qty).toLocaleString()} đ</div>
                    </List.Item>
                    )}
                />
              </div>
            </Col>

            {/* --- CỘT PHẢI --- */}
            <Col span={10}>
               <h3 style={{color: '#b71c1c', marginBottom: 15}}>Payment & Delivery</h3>
               
               <div style={{marginBottom: 15}}>
                   <label style={{fontWeight: 'bold', display: 'block', marginBottom: 5}}>Payment Method</label>
                   <Select value={paymentMethod} onChange={setPaymentMethod} style={{width: '100%'}}>
                       <Option value="cash">Cash</Option>
                       <Option value="bank">Bank Transfer</Option>
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
                   <TextArea rows={3} value={customerInfo.note} onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})} />
               </div>

               <div style={{backgroundColor: '#fff7e6', padding: 15, borderRadius: 8}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18, color: '#b71c1c'}}>
                       <span>Total:</span>
                       <span>{calculateTotal().toLocaleString()} đ</span>
                   </div>
               </div>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button onClick={onCancel} style={{marginRight: 10}}>Close</Button>
            <Button type="primary" onClick={handleSave} style={{backgroundColor: '#b71c1c'}}>Save Order</Button>
          </div>
        </div>
      </Modal>

      <Modal title="Select Product" open={isProductPickerOpen} onCancel={() => setIsProductPickerOpen(false)} footer={null}>
        <Input.Search placeholder="Search product..." onChange={(e) => setSearchKeyword(e.target.value)} style={{ marginBottom: 12 }} />
        <div style={{height: 400, overflowY: 'auto'}}>
            <List
            dataSource={filteredProducts}
            renderItem={(item) => (
                <List.Item actions={[<Button type="primary" size="small" onClick={() => handleAddProductToCart(item)}>Add</Button>]}>
                <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={`${Number(item.price).toLocaleString()} đ`}
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