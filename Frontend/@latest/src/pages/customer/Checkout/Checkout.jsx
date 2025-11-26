import "./Checkout.css";
import { useMemo, useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { formatVND } from "../../../lib/money";
import { Link, useNavigate } from "react-router-dom";
import { generateOrderId, saveOrder } from "../../../lib/orders.js";
import axios from "axios";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"];
const DISTRICTS = {
  "Hà Nội": ["Ba Đình", "Hai Bà Trưng", "Cầu Giấy"],
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Bình Thạnh"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Thanh Khê"],
};
const WARDS = {
  "Ba Đình": ["Phúc Xá", "Trúc Bạch", "Liễu Giai"],
  "Hai Bà Trưng": ["Bạch Mai", "Thanh Nhàn", "Vĩnh Tuy"],
  "Cầu Giấy": ["Dịch Vọng", "Nghĩa Tân", "Yên Hòa"],
  "Quận 1": ["Bến Nghé", "Bến Thành"],
  "Quận 3": ["Võ Thị Sáu", "Phường 7"],
  "Bình Thạnh": ["26", "25"],
  "Hải Châu": ["Hòa Thuận", "Thanh Bình"],
  "Sơn Trà": ["An Hải Bắc", "Phước Mỹ"],
  "Thanh Khê": ["An Khê", "Chính Gián"],
};

export default function Checkout() {
  const cart = useCart();
  const nav = useNavigate();

  // form state
  const [customer, setCustomer] = useState({ name: "", phone: "", note: "" });
  const [receiverSame, setReceiverSame] = useState(true);
  const [receiver, setReceiver] = useState({ name: "", phone: "" });

  const [city, setCity] = useState("Hà Nội");
  const [district, setDistrict] = useState("Hai Bà Trưng");
  const [ward, setWard] = useState("Bạch Mai");
  const [street, setStreet] = useState("");

  const [invoice, setInvoice] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [slot, setSlot] = useState("Morning (7PM-11PM)");

  const [voucher, setVoucher] = useState("");
  const [voucherMsg, setVoucherMsg] = useState("");
  const [payment, setPayment] = useState("bank"); // bank | cod

  // phí/giảm giá
  const shipFee = 15000;
  const discount = 0;

  const voucherDiscount = useMemo(() => {
    // demo: BA25 giảm 25k; FREESHIP miễn ship
    if (voucher.toUpperCase() === "BA25") return 25000;
    return 0;
  }, [voucher]);
  const freeShip = voucher.toUpperCase() === "FREESHIP";

  const subtotal = cart.subtotal;
  const total = Math.max(
    0,
    subtotal - discount - voucherDiscount + (freeShip ? 0 : shipFee)
  );

  function applyVoucher() {
    if (voucher.toUpperCase() === "BA25") {
      setVoucherMsg("Apply code BA25: decrease by 25.000₫");
    } else if (voucher.toUpperCase() === "FREESHIP") {
      setVoucherMsg("Apply code FREESHIP: free ship");
    } else if (!voucher) {
      setVoucherMsg("");
    } else {
      setVoucherMsg("Invalid voucher code");
    }
  }

  function valid() {
    if (!customer.name.trim() || !customer.phone.trim()) return false;
    if (!receiverSame && (!receiver.name.trim() || !receiver.phone.trim())) return false;
    if (!street.trim()) return false;
    if (cart.items.length === 0) return false;
    return true;
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!valid()) return;
    const cus_id = JSON.parse(localStorage.getItem("auth:user:v1")).id;
    const orderId = generateOrderId();
    const placedAt = new Date().toISOString();
    const payload = {
      id: orderId,
      cus_id: cus_id,
      status: "Processing",
      placedAt,
      customer,
      receiver: receiverSame ? customer : receiver,
      address: { city, district, ward, street },
      invoice,
      time: { date, slot },
      payment,
      items: cart.items,
      prices: {
        subtotal,
        discount,
        voucherDiscount,
        ship: freeShip ? 0 : shipFee,
        total,
      },
      voucher: voucher.toUpperCase() || null,
      timeline: [
        { label: "Order placed", time: placedAt, note: "Pending" },
        { label: "Preparing", time: null, note: "Preparing" },
        { label: "On delivery", time: null, note: "Deliveried by shipper" },
      ],
    };
    try {
      await axios.post(`${API_URL}/api/orders`, payload, {
        withCredentials: true
      });
      saveOrder(payload);
      cart.clear();
      nav(`/order-success/${orderId}`);
    } catch (err) {
        console.error("Failed to place order", err);
        alert("Cannot place order. Try again.");
    }
  }

  const districts = DISTRICTS[city] || [];
  const wards = WARDS[district] || [];

  return (
    <>
      <Header />
      <main className="checkout">
        <div className="container">
          <h1 className="co__title">Order Confirmation</h1>

        <div className="co__grid">
          {/* LEFT */}
          <form className="co__left" onSubmit={placeOrder}>
            {/* Customer info */}
            <section className="co__card">
              <div className="co__cardTitle">Customer information</div>

              <label className="co__row">
                <span>Full name</span>
                <input
                  value={customer.name}
                  onChange={e => setCustomer(c => ({...c, name:e.target.value}))}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </label>

              <label className="co__row">
                <span>Phone number</span>
                <input
                  value={customer.phone}
                  onChange={e => setCustomer(c => ({...c, phone:e.target.value}))}
                  placeholder="09xx xxx xxx"
                  required
                />
              </label>

              <label className="co__row co__row--full">
                <span>Note</span>
                <textarea
                  value={customer.note}
                  onChange={e => setCustomer(c => ({...c, note:e.target.value}))}
                  placeholder="e.g., No lettering"
                />
              </label>
            </section>

            {/* Receiver */}
            <section className="co__card">
              <div className="co__cardTitle">Recipient information</div>

              <label className="co__check">
                <input
                  type="checkbox"
                  checked={receiverSame}
                  onChange={e => setReceiverSame(e.target.checked)}
                />
                <span>Same as customer</span>
              </label>

              {!receiverSame && (
                <>
                  <label className="co__row">
                    <span>Full name</span>
                    <input
                      value={receiver.name}
                      onChange={e => setReceiver(r => ({...r, name:e.target.value}))}
                      placeholder="Recipient name"
                      required
                    />
                  </label>
                  <label className="co__row">
                    <span>Phone number</span>
                    <input
                      value={receiver.phone}
                      onChange={e => setReceiver(r => ({...r, phone:e.target.value}))}
                      placeholder="09xx xxx xxx"
                      required
                    />
                  </label>
                </>
              )}

              {/* Address */}
              <div className="co__row">
                <span>City/Province</span>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="co__row">
                <span>District</span>
                <select value={district} onChange={e => setDistrict(e.target.value)}>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="co__row">
                <span>Ward</span>
                <select value={ward} onChange={e => setWard(e.target.value)}>
                  {wards.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>

              <label className="co__row co__row--full">
                <span>Detailed address</span>
                <input
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="House number, street, etc."
                  required
                />
              </label>
            </section>

            {/* Invoice */}
            <section className="co__card">
              <label className="co__check">
                <input type="checkbox" checked={invoice} onChange={e => setInvoice(e.target.checked)} />
                <span>Request invoice for this order</span>
              </label>
            </section>

            {/* Delivery time */}
            <section className="co__card">
              <div className="co__cardTitle">Delivery time</div>
              <div className="co__row">
                <span>Delivery date</span>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="co__row">
                <span>Delivery time slot</span>
                <select value={slot} onChange={e => setSlot(e.target.value)}>
                  <option>Morning (7AM-11AM)</option>
                  <option>Noon (11AM-2PM)</option>
                  <option>Afternoon (2PM-6PM)</option>
                  <option>Evening (6PM-9PM)</option>
                </select>
              </div>

              <ul className="co__note">
                <li>Note: Delivery time may vary by 1 hour.</li>
                <li>No deliveries after 7:30 PM.</li>
                <li>For urgent orders, please contact our hotline.</li>
              </ul>
            </section>

            {/* Submit */}
            <button className="co__submit" type="submit" disabled={!valid()}>
              Place Order
            </button>

            <div className="co__back">
              <Link to="/cart">← Back to cart</Link>
            </div>
          </form>

          {/* RIGHT */}
          <aside className="co__right">
            <section className="co__card">
              <div className="co__cardTitle">Payment</div>

              {cart.items.map(it => (
                <div key={it.id} className="co__item">
                  <div className="co__itemInfo">
                    <img src={it.image} alt="" />
                    <div>
                      <div className="co__itemName">{it.name}</div>
                      <div className="co__itemSku">Quantity: {it.qty}</div>
                    </div>
                  </div>
                  <div className="co__itemSum">{formatVND(it.price * it.qty)}</div>
                </div>
              ))}

              <div className="co__hr" />

              <div className="co__line"><span>Subtotal:</span><span>{formatVND(subtotal)}</span></div>
              {discount > 0 && <div className="co__line"><span>Discount</span><span>-{formatVND(discount)}</span></div>}
              {voucherDiscount > 0 && <div className="co__line"><span>Voucher</span><span>-{formatVND(voucherDiscount)}</span></div>}
              <div className="co__line"><span>Estimated shipping fee:</span><span>{freeShip ? "0₫" : formatVND(shipFee)}</span></div>

              <div className="co__grand">
                <span>Total:</span>
                <strong>{formatVND(total)}</strong>
              </div>

              {/* Voucher */}
              <div className="co__voucher">
                <input
                  placeholder="Voucher code (e.g: BA25, FREESHIP)"
                  value={voucher}
                  onChange={e => setVoucher(e.target.value)}
                />
                <button onClick={applyVoucher} type="button">Apply</button>
              </div>
              {voucherMsg && <div className="co__voucherMsg">{voucherMsg}</div>}
            </section>

            {/* Shipping policy */}
            <section className="co__card">
              <div className="co__cardTitle">Shipping fee</div>
              <ol className="co__policy">
                <li>Inner Hanoi: flat rate 15,000₫.</li>
                <li>FREESHIP with a valid promo code.</li>
                <li>Delivery hours: 7:00 AM – 9:00 PM daily.</li>
              </ol>
            </section>

            {/* Payment method */}
            <section className="co__card">
              <div className="co__cardTitle">Payment Method</div>
              <label className="co__radio">
                <input type="radio" name="pm" checked={payment==="bank"} onChange={() => setPayment("bank")} />
                <span>Bank transfer</span>
              </label>
              <label className="co__radio">
                <input type="radio" name="pm" checked={payment==="cod"} onChange={() => setPayment("cod")} />
                <span>Cash on Delivery (COD)</span>
              </label>
            </section>
          </aside>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}