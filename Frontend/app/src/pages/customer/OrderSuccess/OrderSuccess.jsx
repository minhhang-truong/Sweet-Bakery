import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import "./OrderSuccess.css";
import { formatVND } from "../../../lib/money.js";
import api from "../../../lib/axiosCustomer.js"; // Import axios instance

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // State để lưu dữ liệu thật từ API
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchOrder() {
      try {
        // Gọi API lấy chi tiết đơn hàng (dùng chung endpoint track)
        const res = await api.get(`/api/orders/track/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleTrack = () => {
    navigate(`/track/${orderId}`);
  };

  // Hàm format thời gian hiển thị
  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      <main className="orderSuccess">
        <div className="container">
          
          {loading && <div style={{textAlign: 'center', padding: '50px'}}>Loading order details...</div>}

          {!loading && !order ? (
            <section className="orderSuccess__card">
              <h1>Order not found</h1>
              <p>
                We couldn’t find the order ID <strong>{orderId}</strong>. Please
                check the code again or contact our support team.
              </p>
              <div className="orderSuccess__actions">
                <Link to="/menu">Return to menu</Link>
              </div>
            </section>
          ) : !loading && order && (
            <section className="orderSuccess__card">
              <p className="orderSuccess__eyebrow">Thank you</p>
              <h1>Order placed successfully!</h1>
              <p>
                Keep this code to track progress or share with customer support
                if needed.
              </p>
              
              {/* Hiển thị ID từ DB */}
              <div className="orderSuccess__code">{order.order_id || order.id}</div>

              <div className="orderSuccess__summary">
                <div>
                  <span>Total</span>
                  {/* Hiển thị total_amount từ DB */}
                  <strong>{formatVND(order.total_amount)}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong style={{ textTransform: 'capitalize' }}>
                    {order.payment === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                  </strong>
                </div>
                <div>
                  <span>Delivery Time</span>
                  {/* Hiển thị receive_time từ DB */}
                  <strong>
                    {formatTime(order.receive_time)}
                  </strong>
                </div>
              </div>

              <div className="orderSuccess__actions">
                <button onClick={handleTrack}>Track this order</button>
                <Link to="/orders">View order history</Link>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}