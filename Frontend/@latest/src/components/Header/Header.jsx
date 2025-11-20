import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
export default function Header() {
  const cart = useCart();
  const auth = useAuth();
  return (
    <header className="hdr">
      {/* Top bar */}
      <div className="container hdr__top">
        <Link to="/" className="hdr__brand">
          <img src="/logo.png" alt="Sweet Bakery" />
        </Link>

        {/* Search left */}
        <form className="hdr__search">
          <input type="text" placeholder="Find you cake" aria-label="Search cake" />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        {/* Track order */}
        <form className="hdr__track">
          <input type="text" placeholder="Track your Order - Enter Order's ID" aria-label="Track order" />
          <button type="submit" aria-label="Track">🔎</button>
        </form>

        {/* Actions */}
        <nav className="hdr__actions">
          {/* Nếu CHƯA đăng nhập */}
          {!auth.isAuthed ? (
            <>
              <Link to="/signin">Sign in</Link>
              <Link to="/signup">Sign up</Link>
              <Link to="/cart">🛒 Cart ({cart.count})</Link>
            </>
          ) : (
            <>
              <span>Hi, <strong>{auth.user.name}</strong></span>
              <Link to="/account">My account</Link>
              <button className="icon-btn" onClick={auth.logout} title="Sign out">⎋</button>
              <Link to="/cart">🛒 Cart ({cart.count})</Link>
            </>
          )}
        </nav>
      </div>

      {/* Category bar (pink) */}
      <div className="hdr__cats">
        <div className="container hdr__cats__inner">
          <NavLink to="/birthday" className="cat">Birthday cake</NavLink>
          <NavLink to="/mousse" className="cat">Mousse</NavLink>
          <NavLink to="/cupcake" className="cat">Cupcake</NavLink>
          <NavLink to="/cookies" className="cat">Cookies & Mini cake</NavLink>
          <NavLink to="/choux" className="cat">Cream choux</NavLink>
        </div>
      </div>
    </header>
  );
}
