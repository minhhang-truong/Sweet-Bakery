import "./Header.css";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getMenu } from "../../../data/menuData.js";
import logoImg from '../../../assets/images/common/logo-sweet-bakery.png'; 

export default function Header() {
  const cart = useCart();
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuSections, setMenuSections] = useState([]);
  const [trackId, setTrackId] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load menu from backend or cache
  useEffect(() => {
    async function loadMenu() {
      const menu = await getMenu(); // Cached or fetch
      setMenuSections(menu);
    }
    loadMenu();
  }, []);

  const scrollToMenuItem = (itemId) => {
    const targetId = `menu-item-${itemId}`;
    navigate("/menu", { state: { scrollToId: targetId } });
  };

  const onLogout = () => {
    auth.logout();
    navigate("/");
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/search?product=${encodeURIComponent(term)}`);
    setSearchTerm("");
  };

  return (
    <header className="hdr">
      {/* Top bar */}
      <div className="container hdr__top">
        <Link to="/" className="hdr__brand">
          <img src={logoImg} alt="Sweet Bakery" />
        </Link>

        {/* Search */}
        <form className="hdr__search" onSubmit={onSearchSubmit}>
          <input
            type="text"
            placeholder="Find your cake"
            aria-label="Search cake"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>

        {/* Track order */}
        <form
          className="hdr__track"
          onSubmit={(e) => {
            e.preventDefault();
            if (!trackId.trim()) return;
            navigate(`/track/${trackId.trim().toUpperCase()}`);
            setTrackId("");
          }}
        >
          <input
            type="text"
            placeholder="Enter Order's ID"
            aria-label="Track order"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />
          <button type="submit" aria-label="Track">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>

        {/* Actions */}
        <nav className="hdr__actions">
          {!auth.isAuthed ? (
            <>
              <Link to={`/signin?redirect=${location.pathname.substring(1)}`} className="hdr__action-item">
                <span className="hdr__icon-circle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span>Sign in</span>
              </Link>
              <Link to="/signup" className="hdr__action-item">
                <span className="hdr__icon-circle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </span>
                <span>Sign up</span>
              </Link>
              <Link to="/cart" className="hdr__action-item hdr__action-item--cart">
                <span className="hdr__icon-circle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </span>
                {cart.count > 0 && <span className="hdr__cart-count">{cart.count}</span>}
              </Link>
            </>
          ) : (
            <>
              <span className="hdr__action-item hdr__action-item--greeting">
                <span className="hdr__icon-circle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <span>Hi, <strong>{auth.user.name}</strong></span>
              </span>
              <div
                className={`hdr__account ${isAccountOpen ? "open" : ""}`}
                ref={accountRef}
              >
                <button
                  type="button"
                  className="hdr__action-item"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                >
                  <span className="hdr__icon-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <span>Account</span>
                  <span className="hdr__accountChevron">▾</span>
                </button>
                {isAccountOpen && (
                  <div className="hdr__accountMenu">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigate("/account");
                      }}
                    >
                      View information
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigate("/change-password");
                      }}
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigate("/orders");
                      }}
                    >
                      
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        onLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <Link to="/cart" className="hdr__action-item hdr__action-item--cart">
                <span className="hdr__icon-circle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </span>
                {cart.count > 0 && <span className="hdr__cart-count">{cart.count}</span>}
              </Link>
              
            </>
          )}
        </nav>
      </div>

      {/* Category bar (pink) */}
      <nav className="mainNav">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About Us</Link>
        <Link to="/faq">Policy</Link>
        <Link to="/contact">Contact</Link>
      </nav>

    </header>
  );
}