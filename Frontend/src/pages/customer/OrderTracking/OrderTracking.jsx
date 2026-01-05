import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import api from "../../../lib/axiosCustomer.js";
import "./OrderTracking.css";
import { formatVND } from "../../../lib/money.js";

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/orders/track/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          const redirect = encodeURIComponent(
            location.pathname
          );
          navigate(`/signin?redirect=track/${orderId}`, { replace: true });
          return;
        }
        setError(err.response?.data?.error || "Order not found");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (!order && !error) return null;

  return (
    <>
      <Header />
      <main className="trackPage">
        <div className="container">
          {error ? (
            <section className="trackBox">
              <h1>{error}</h1>
              <p>
                Please check your order code again <strong>{orderId}</strong>. If you are sure the code is correct, please contact the hotline for support.
              </p>
              <Link to="/menu">Go back to menu</Link>
            </section>
          ) : (
            <section className="trackBox">
              <p className="trackEyebrow">Tracking</p>
              <h1>Status of {order.id}</h1>
              <div className="trackStatusChip">{order.status}</div>
              <p className="trackTotal">
                Total: <strong>{formatVND(order.total_amount)}</strong>
              </p>

              <div className="trackTimeline">
                {order.timeline?.map((step, index) => (
                  <div className="trackStep" key={index}>
                    <div className="trackDot" />
                    <div>
                      <h3>{step.label}</h3>
                      <p>{formatDateTime(step.time)}</p>
                      <small>{step.note}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="trackMeta">
                <div>
                  <span>Recipient </span>
                  <strong>{order.receiver}</strong>
                </div>
                <div>
                  <span>Phone </span>
                  <strong>{order.receive_phone}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <p>
                    {order.receive_address}
                  </p>
                </div>
                <div>
                  <span>Expected delivery date</span>
                  <p>
                    {new Date(order.receive_date).toLocaleDateString()} - {order.receive_time}
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
