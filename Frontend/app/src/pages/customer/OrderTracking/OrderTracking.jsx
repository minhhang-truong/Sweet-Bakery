import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import api from "../../../lib/axiosCustomer.js";
import "./OrderTracking.css";
import { formatVND } from "../../../lib/money.js";

function formatDateTime(iso) {
  if (!iso) return "Updating";
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/orders/track/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
           setError("Please login to view this order.");
        } else {
           setError("Order not found or access denied.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Hàm helper để map địa chỉ từ các cột DB
  const getFullAddress = (o) => {
      // Backend mới trả về: receiver_street, receiver_ward, receiver_district, receiver_city
      // Nếu Model trả về đúng tên cột DB:
      if(o.receiver_street) {
          return `${o.receiver_street}, ${o.receiver_ward || ''}, ${o.receiver_district || ''}, ${o.receiver_city || ''}`;
      }
      // Fallback nếu cột vẫn tên cũ (tùy backend trả về gì)
      return o.receive_address || "N/A";
  }

  return (
    <>
      <Header />
      <main className="trackPage">
        <div className="container">
          <div className="trackHeader">
            <h1>Track Order</h1>
            <p>Order ID: <strong>{orderId}</strong></p>
          </div>

          {loading && <div className="trackLoading">Loading...</div>}
          
          {error && (
            <div className="trackError">
              <p>{error}</p>
              <Link to="/menu" className="trackBack">Back to Menu</Link>
            </div>
          )}

          {!loading && !error && order && (
            <section className="trackCard">
              <div className="trackStatus">
                Status: <span className={`statusTag is-${order.status}`}>{order.status?.toUpperCase()}</span>
              </div>
              
              <p className="trackTotal">
                Total: <strong>{formatVND(order.total_amount)}</strong>
              </p>

              {/* Timeline giả lập vì DB mới không lưu timeline JSON chi tiết, 
                  hoặc bạn có thể tự build logic dựa trên status */}
              <div className="trackTimeline">
                  <div className="trackStep">
                    <div className="trackDot" />
                    <div>
                      <h3>Order Placed</h3>
                      <p>{formatDateTime(order.order_time || order.orderdate)}</p>
                    </div>
                  </div>
                  {order.status === 'completed' && (
                      <div className="trackStep">
                        <div className="trackDot" />
                        <div>
                          <h3>Delivered</h3>
                          <p>{formatDateTime(order.receive_time)}</p>
                        </div>
                      </div>
                  )}
              </div>

              <div className="trackMeta">
                <div>
                  <span>Recipient </span>
                  {/* SỬA: map cột receiver_name */}
                  <strong>{order.receiver_name || order.receiver}</strong>
                </div>
                <div>
                  <span>Phone </span>
                  {/* SỬA: map cột receiver_phone */}
                  <strong>{order.receiver_phone || order.receive_phone}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <p>{getFullAddress(order)}</p>
                </div>
                <div>
                  <span>Expected delivery</span>
                  <p>
                    {/* SỬA: map cột receive_time (timestamp) */}
                    {order.receive_time ? formatDateTime(order.receive_time) : "Updating..."}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}