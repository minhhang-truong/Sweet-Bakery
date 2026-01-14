import "./Checkout.css";
import { useMemo, useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { formatVND } from "../../../lib/money";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../lib/axiosCustomer.js";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import { message } from "antd";

export default function Checkout() {
  const cart = useCart();
  const nav = useNavigate();

  // --- FORM STATE ---
  const [customer, setCustomer] = useState({ name: "", phone: "", note: "" });
  const [receiverSame, setReceiverSame] = useState(true);
  const [receiver, setReceiver] = useState({ name: "", phone: "" });

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [deliveryTime, setDeliveryTime] = useState("09:00"); 

  const [voucher, setVoucher] = useState("");
  const [voucherMsg, setVoucherMsg] = useState("");
  const [payment, setPayment] = useState("bank"); 
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [orderPayload, setOrderPayload] = useState(null);

  // --- LOGIC TÍNH TOÁN (ĐÃ SỬA: BỎ SHIP FEE) ---
  const shipFee = 0; // Không tính phí ship nữa
  const discount = 0;

  const voucherDiscount = useMemo(() => {
    if (voucher.toUpperCase() === "BA25") return 25000;
    return 0;
  }, [voucher]);

  const subtotal = cart.subtotal;
  
  // Tổng tiền chỉ là tiền hàng - giảm giá
  const total = Math.max(0, subtotal - discount - voucherDiscount);

  function applyVoucher() {
    if (voucher.toUpperCase() === "BA25") {
      setVoucherMsg("Apply code BA25: decrease by 25.000₫");
    } else if (!voucher) {
      setVoucherMsg("");
    } else {
      setVoucherMsg("Invalid voucher code");
    }
  }

  function valid() {
    if (!customer.name.trim() || !customer.phone.trim()) return false;
    if (!receiverSame && (!receiver.name.trim() || !receiver.phone.trim())) return false;
    if (!street.trim() || !ward.trim() || !district.trim() || !city.trim()) return false;
    if (cart.items.length === 0) return false;
    return true;
  }

  const generateSafeOrderId = () => {
    const numbers = "0123456789";
    let res = "ORD"; 
    for(let i = 0; i < 9; i++){
        res += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return res; 
  };

  async function placeOrder(e) {
    e.preventDefault();
    if (!valid()) {
        message.error("Please fill in all required fields");
        return;
    }

    try {
        const userStr = localStorage.getItem("auth:user:v1");
        const cus_id = userStr ? JSON.parse(userStr).id : 1;
        const orderId = generateSafeOrderId();
        
        const payload = {
          id: orderId,
          cus_id: cus_id,
          status: "pending",
          customer: { ...customer },
          receiver: receiverSame ? { name: customer.name, phone: customer.phone } : receiver,
          
          // Address Object
          address: {
              street: street,
              ward: ward,
              district: district,
              city: city
          },
          
          time: { date, time: deliveryTime }, 
          
          payment: payment.toLowerCase(), // 'bank' | 'cod'
          
          items: cart.items.map(item => ({
              id: item.id,
              qty: item.qty,
              price: item.price
          })),
          
          prices: {
            subtotal, discount, voucherDiscount,
            ship: 0, 
            total: total, // Tổng tiền sản phẩm
          },
        };

        if (payment === "bank") {
          setOrderPayload(payload);
          setShowQRPopup(true);
          return;
        }

        await submitOrder(payload);

    } catch (err) {
        console.error(err);
        message.error("Error preparing order");
    }
  }
    
  async function submitOrder(payload) {
    try {
      await api.post(`/api/orders`, payload);
      cart.clear();
      message.success("Order placed successfully!");
      nav(`/order-success/${payload.id}`);
    } catch (err) {
        console.error("Failed to place order", err);
        message.error(err.response?.data?.error || "Cannot place order. Try again.");
    }
  }

  function handleQRConfirm() {
    setShowQRPopup(false);
    if (orderPayload) submitOrder(orderPayload);
  }

  function handleQRCancel() {
    setShowQRPopup(false);
    setOrderPayload(null);
  }

  return (
    <>
      <Header />
      <main className="checkout">
        <div className="container">
          <h1 className="co__title">Order Confirmation</h1>

        <div className="co__grid">
          {/* LEFT FORM */}
          <form className="co__left" onSubmit={placeOrder}>
            <section className="co__card">
              <div className="co__cardTitle">Customer information</div>
              <label className="co__row">
                <span>Full name</span>
                <input value={customer.name} onChange={e => setCustomer(c => ({...c, name:e.target.value}))} placeholder="Your Name" required />
              </label>
              <label className="co__row">
                <span>Phone number</span>
                <input value={customer.phone} onChange={e => setCustomer(c => ({...c, phone:e.target.value}))} placeholder="Your Phone" required />
              </label>
              <label className="co__row co__row--full">
                <span>Note</span>
                <textarea value={customer.note} onChange={e => setCustomer(c => ({...c, note:e.target.value}))} placeholder="Note for shop..." />
              </label>
            </section>

            <section className="co__card">
              <div className="co__cardTitle">Recipient information</div>
              <label className="co__check">
                <input type="checkbox" checked={receiverSame} onChange={e => setReceiverSame(e.target.checked)} />
                <span>Same as customer</span>
              </label>

              {!receiverSame && (
                <>
                  <label className="co__row">
                    <span>Full name</span>
                    <input value={receiver.name} onChange={e => setReceiver(r => ({...r, name:e.target.value}))} placeholder="Recipient Name" required />
                  </label>
                  <label className="co__row">
                    <span>Phone number</span>
                    <input value={receiver.phone} onChange={e => setReceiver(r => ({...r, phone:e.target.value}))} placeholder="Recipient Phone" required />
                  </label>
                </>
              )}

              <div className="co__row">
                <span>City / Province</span>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ex: Ha Noi" required />
              </div>
              <div className="co__row">
                <span>District</span>
                <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Ex: Hai Ba Trung" required />
              </div>
              <div className="co__row">
                <span>Ward</span>
                <input value={ward} onChange={e => setWard(e.target.value)} placeholder="Ex: Bach Khoa" required />
              </div>
              <label className="co__row co__row--full">
                <span>Street</span>
                <input value={street} onChange={e => setStreet(e.target.value)} placeholder="Ex: No 1 Dai Co Viet" required />
              </label>
            </section>

            <section className="co__card">
              <div className="co__cardTitle">Delivery time</div>
              <div className="co__row">
                <span>Delivery date</span>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="co__row">
                <span>Specific time</span>
                <input 
                    type="time" 
                    value={deliveryTime} 
                    onChange={e => setDeliveryTime(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }}
                    required
                />
              </div>
            </section>

            <button className="co__submit" type="submit">Place Order</button>
            <div className="co__back"><Link to="/cart">← Back to cart</Link></div>
          </form>

          {/* RIGHT SUMMARY */}
          <aside className="co__right">
            <section className="co__card">
              <div className="co__cardTitle">Order Summary</div>
              {cart.items.map(it => (
                <div key={it.id} className="co__item">
                  <div className="co__itemInfo">
                    <img src={it.image} alt="" />
                    <div>
                      <div className="co__itemName">{it.name}</div>
                      <div className="co__itemSku">Qty: {it.qty}</div>
                    </div>
                  </div>
                  <div className="co__itemSum">{formatVND(it.price * it.qty)}</div>
                </div>
              ))}
              <div className="co__hr" />
              <div className="co__line"><span>Subtotal:</span><span>{formatVND(subtotal)}</span></div>
              {/* Ship fee luôn là 0 hoặc Free */}
              <div className="co__line"><span>Shipping fee:</span><span>Free</span></div>
              <div className="co__grand"><span>Total:</span><strong>{formatVND(total)}</strong></div>
              
              <div className="co__voucher">
                <input placeholder="Voucher code (BA25)" value={voucher} onChange={e => setVoucher(e.target.value)} />
                <button onClick={applyVoucher} type="button">Apply</button>
              </div>
              {voucherMsg && <div className="co__voucherMsg">{voucherMsg}</div>}
            </section>

            <section className="co__card">
              <div className="co__cardTitle">Payment Method</div>
              <label className="co__radio">
                <input type="radio" name="payment" value="bank" checked={payment === "bank"} onChange={e => setPayment(e.target.value)} />
                <span><strong>Bank Transfer</strong><p style={{margin:0, fontSize:13, color:'#666'}}>Scan QR code</p></span>
              </label>
              <label className="co__radio">
                <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={e => setPayment(e.target.value)} />
                <span><strong>Cash on Delivery</strong><p style={{margin:0, fontSize:13, color:'#666'}}>Pay upon receipt</p></span>
              </label>
            </section>
          </aside>
        </div>
      </div>

      {showQRPopup && (
        <div className="co__qrOverlay" onClick={handleQRCancel}>
          <div className="co__qrModal" onClick={e => e.stopPropagation()}>
            <button className="co__qrClose" onClick={handleQRCancel}>×</button>
            <h2 className="co__qrTitle">Scan QR Code</h2>
            <p className="co__qrSubtitle">Total: {formatVND(total)}</p>
            <div className="co__qrCode"><div className="co__qrPattern"></div></div>
            <div className="co__qrActions">
              <button className="co__qrBtn co__qrBtn--cancel" onClick={handleQRCancel}>Cancel</button>
              <button className="co__qrBtn co__qrBtn--confirm" onClick={handleQRConfirm}>I have paid</button>
            </div>
          </div>
        </div>
      )}
    </main>
    <Footer />
    </>
  );
}