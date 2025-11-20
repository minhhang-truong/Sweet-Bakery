import "./Cart.css";
import { useCart } from "../context/CartContext.jsx";
import { formatVND } from "../lib/money";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const cart = useCart();
  const auth = useAuth();
  const nav = useNavigate();

  function handleCheckout() {
    if (!auth.isAuthed) {
      nav("/signin?redirect=checkout"); // quay lại checkout sau khi login
      return;
    }
    nav("/checkout");
  }

  if (cart.items.length === 0) {
    return (
      <main className="cart">
        <div className="container">
          <h1 className="cart__title">Shopping Cart</h1>
          <p>Giỏ của bạn đang trống.</p>
          <Link to="/menu" className="cart__back">Xem sản phẩm</Link>
        </div>
      </main>
    );
  }

  return (
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
                <button onClick={() => cart.dec(it.id)} aria-label="Decrease">−</button>
                <input
                  value={it.qty}
                  onChange={(e) => cart.setQty(it.id, Number(e.target.value))}
                />
                <button onClick={() => cart.inc(it.id)} aria-label="Increase">+</button>
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
}
