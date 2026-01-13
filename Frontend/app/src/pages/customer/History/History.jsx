import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import "./History.css";
import { useAuth } from "../../../context/AuthContext.jsx";
import { formatVND } from "../../../lib/money.js";
import { useEffect, useState } from "react";
import api from "../../../lib/axiosCustomer.js";

export default function HistoryPage() {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    if (auth.isAuthed) {
      fetchOrderHistory();
    }
  }, [auth.isAuthed]);

  // Hàm helper format ngày giờ
  const formatDate = (isoStr) => {
      if(!isoStr) return "";
      return new Date(isoStr).toLocaleString('vi-VN');
  }

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
                <h1>Sweet moments for {auth.user.fullname || auth.user.name}</h1>
                <p className="historySub">
                  Showing {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              </header>

              <div className="historyTimeline">
                {orders.map((order) => (
                  <article key={order.order_id} className="historyCard">
                    <div className="historyMeta">
                      <div>
                        <p className="historyLabel">Order ID</p>
                        {/* SỬA: order.id -> order.order_id */}
                        <h2>{order.order_id}</h2>
                      </div>
                      <div>
                        <p className="historyLabel">Date</p>
                        {/* SỬA: order.orderdate -> order.order_time */}
                        <strong>{formatDate(order.order_time)}</strong>
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
                      {/* Thêm check order.items tồn tại vì LEFT JOIN có thể trả về null */}
                      {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={`${order.order_id}-${index}`} className="historyItem">
                              <p className="historyItemName">{item.name || "Product Name"}</p>
                              <p className="historyItemMeta">
                                Qty {item.qty} · {formatVND(item.price)}
                              </p>
                            </div>
                          ))
                      ) : (
                          <p style={{fontStyle: 'italic', color: '#999'}}>No detail items found</p>
                      )}
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