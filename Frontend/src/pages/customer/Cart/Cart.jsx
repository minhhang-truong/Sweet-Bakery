import "./Cart.css";
import { useCart } from "../../../context/CartContext.jsx";
import { formatVND } from "../../../lib/money.js";
import { Link } from "react-router-dom";
import Header from '../../../components/common/Header/Header.jsx';
import Footer from '../../../components/common/Footer/Footer.jsx';
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const cart = useCart();
  const auth = useAuth();
  const nav = useNavigate();
  const [editingQty, setEditingQty] = useState({});

  function handleCheckout() {
    if (!auth.isAuthed) {
      nav("/signin?redirect=checkout"); // quay lại checkout sau khi login
      return;
    }
    nav("/checkout");
  }

  useEffect(() => {
    const nextState = {};
    cart.items.forEach((item) => {
      nextState[item.id] = String(item.qty);
    });
    setEditingQty(nextState);
  }, [cart.items]);

  const EmptyState = () => (
    <main className="cart">
      <div className="container">
        <h1 className="cart__title">Shopping Cart</h1>
        <p>Your cart is empty now.</p>
        <Link to="/menu" className="cart__back">View more products</Link>
      </div>
    </main>
  );

  const FilledState = () => (
    <main className="cart">
      <div className="container">
        <h1 className="cart__title">Shopping Cart</h1>
        <p className="cart__subtitle">
          You have <strong>{cart.count}</strong> item{cart.count>1?'s':''} in the cart
        </p>

        <div className="cart__table">
          {cart.items.map((it) => (
            <div key={it.id} className="cart__row">
              <img src={it.image} alt="" className="cart__thumb" />
              <div className="cart__info">
                <div className="cart__name">{it.name}</div>
                <div className="cart__price">{formatVND(it.price)}</div>
              </div>

              <div className="cart__qty">
                <button
                  onClick={() => {
                    const base = Number(editingQty[it.id]) || it.qty;
                    const next = Math.max(1, base - 1);
                    cart.setQty(it.id, next);
                    setEditingQty((prev) => ({ ...prev, [it.id]: String(next) }));
                  }}
                  aria-label="Decrease"
                >
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  min="1"
                  value={editingQty[it.id] ?? it.qty}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setEditingQty((prev) => ({ ...prev, [it.id]: value }));
                      if (value !== "") {
                        const next = Math.max(1, Number(value));
                        cart.setQty(it.id, next);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const nextVal = Number(e.target.value);
                    const safe = !e.target.value || nextVal < 1 ? 1 : nextVal;
                    cart.setQty(it.id, safe);
                    setEditingQty((prev) => ({ ...prev, [it.id]: String(safe) }));
                  }}
                />
                <button
                  onClick={() => {
                    const base = Number(editingQty[it.id]) || it.qty;
                    const next = base + 1;
                    cart.setQty(it.id, next);
                    setEditingQty((prev) => ({ ...prev, [it.id]: String(next) }));
                  }}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <div className="cart__sum">{formatVND(it.price * it.qty)}</div>
              <button className="cart__remove" onClick={() => cart.remove(it.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart__totals">
          <div className="cart__line">
            <span>Subtotal</span>
            <strong>{formatVND(cart.subtotal)}</strong>
          </div>
          {/* sau này thêm ship/discount ở đây */}
          <div className="cart__actions">
            <Link to="/menu" className="cart__back">← Continue shopping</Link>
            <button className="cart__checkout" onClick={handleCheckout}>Proceed to checkout</button>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <>
      <Header />
      {cart.items.length === 0 ? <EmptyState /> : <FilledState />}
      <Footer />
    </>
  );
}