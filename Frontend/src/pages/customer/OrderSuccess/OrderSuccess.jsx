import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import "./OrderSuccess.css";
import { findOrderById } from "../../../lib/orders.js";
import { formatVND } from "../../../lib/money.js";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = findOrderById(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = () => {
    navigate(`/track/${orderId}`);
  };

  return (
    <>
      <Header />
      <main className="orderSuccess">
        <div className="container">
          {!order ? (
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
          ) : (
            <section className="orderSuccess__card">
              <p className="orderSuccess__eyebrow">Thank you</p>
              <h1>Order placed successfully!</h1>
              <p>
                Keep this code to track progress or share with customer support
                if needed.
              </p>
              <div className="orderSuccess__code">{order.id}</div>

              <div className="orderSuccess__summary">
                <div>
                  <span>Total</span>
                  <strong>{formatVND(order.prices.total)}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>
                    {order.payment === "bank"
                      ? "Bank transfer"
                      : "Cash on delivery"}
                  </strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>
                    {order.time.date} · {order.time.slot}
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