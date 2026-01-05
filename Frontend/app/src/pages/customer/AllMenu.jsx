// src/pages/AllMenu.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/common/Header/Header.jsx";
import Footer from "../../components/common/Footer/Footer.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { getMenu } from "../../data/menuData.js";
import { formatVND } from "../../lib/money.js";

export default function AllMenu() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useCart();

  const [menuSections, setMenuSections] = useState([]); // API data
  const [loading, setLoading] = useState(true);

  // Fetch menu from backend
  useEffect(() => {
    let active = true;

    async function loadMenu() {
      const data = await getMenu(); // always returns array
      if (active) {
        setMenuSections(data);
        setLoading(false);
      }
    }

    loadMenu();
    return () => (active = false);
  }, []);

  // Scroll to specific item (deep-linking)
  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    if (scrollToId) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollToId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // Categories generated dynamically from API
  const categories = menuSections.map((s) => ({
    label: s.category,
    slug: s.slug,
  }));

  // Active category (if slug provided)
  const activeSection = slug
    ? menuSections.find((s) => s.slug === slug)
    : null;

  const title = activeSection ? activeSection.category : "All Products";

  const items = useMemo(() => {
    if (activeSection) return activeSection.items;

    // Flatten all products
    return menuSections.flatMap((s) =>
      s.items.map((it) => ({
        ...it,
        _section: s.category,
      }))
    );
  }, [menuSections, activeSection]);

  if (loading) {
    return (
      <>
        <Header />
        <section className="menu">
          <div className="container">
            <h2 className="menu__title">Loading menu...</h2>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="menu">
        <div className="container">
          <h2 className="menu__title">{title}</h2>

          {/* Tabs for category selection */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              margin: "10px 0 20px",
            }}
          >
            <Link to="/menu" className="menu__btn">
              All
            </Link>

            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/menu/${c.slug}`}
                className="menu__btn"
                style={{
                  background: slug === c.slug ? "#d94a4a" : "",
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>

          <div className="menu__grid">
            {items.map((item) => (
              <article
                key={item.id}
                id={`menu-item-${item.id}`}
                className="menu__card"
              >
                <div className="menu__thumbWrap">
                  <img className="menu__img" src={item.image} alt={item.name} />
                </div>

                {item._section && (
                  <p className="menu__categoryName">{item._section}</p>
                )}

                <h4 className="menu__name">{item.name}</h4>

                {item.price && (
                  <p className="menu__price">Price: {formatVND(item.price)}</p>
                )}

                <div className="menu__row">
                  <button
                    className="menu__btn"
                    onClick={() => cart.add(item)}
                  >
                    Add to cart
                  </button>

                  <button
                    className="menu__btnSecondary"
                    onClick={() => {
                      cart.add(item);
                      navigate("/cart");
                    }}
                  >
                    Buy now
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/" className="menu__back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
