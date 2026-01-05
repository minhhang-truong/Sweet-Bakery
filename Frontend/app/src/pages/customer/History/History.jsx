import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import "./History.css";
import { useAuth } from "../../../context/AuthContext.jsx";
import { formatVND } from "../../../lib/money.js";
import { useEffect, useState } from "react";
import api from "../../../lib/axiosCustomer.js";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function HistoryPage() {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);

  // Move fetch function OUTSIDE useEffect
  async function fetchOrderHistory() {
    try {
      const res = await api.get(
        `/api/orders/history/${auth.user.id}`
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load order history:", error);
    }
  }

  // Load when user is authenticated
  useEffect(() => {
    if (auth.isAuthed) {
      fetchOrderHistory();
    }
  }, [auth.isAuthed]);

  return (
    <>
      <Header />
      <main className="historyPage">
        <div className="container">
          {!auth.isAuthed ? (
            <section className="historyEmpty">
              <h1>Please sign in to view your orders</h1>
              <p>
                Dessert history is only available for logged in customers. Sign
                in to revisit your celebrations!
              </p>
            </section>
          ) : (
            <>
              <header className="historyHeader">
                <p className="historyEyebrow">Order history</p>
                <h1>Sweet moments for {auth.user.fullname}</h1>
                <p className="historySub">
                  Showing {orders.length} order
                  {orders.length !== 1 ? "s" : ""} placed with{" "}
                  <strong>{auth.user.email}</strong>
                </p>
              </header>

              <div className="historyTimeline">
                {orders.map((order) => (
                  <article key={order.id} className="historyCard">
                    <div className="historyMeta">
                      <div>
                        <p className="historyLabel">Order ID</p>
                        <h2>{order.id}</h2>
                      </div>
                      <div>
                        <p className="historyLabel">Date</p>
                        <strong>{new Date(order.orderdate).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <p className="historyLabel">Status</p>
                        <span className={`historyStatus is-${(order.status || "").toLowerCase()}`}>
                          {order.status || "Unknown"}
                        </span>

                      </div>
                      <div>
                        <p className="historyLabel">Total</p>
                        <strong>{formatVND(order.total_amount)}</strong>
                      </div>
                    </div>

                    <div className="historyItems">
                      {order.items.map((item, index) => (
                        <div key={`${order.id}-${index}`} className="historyItem">
                          <p className="historyItemName">{item.name}</p>
                          <p className="historyItemMeta">
                            Qty {item.qty} · {formatVND(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
