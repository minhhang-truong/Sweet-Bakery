import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../../components/common/Header/Header.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import { MENU_SECTIONS } from "../../../data/menuData.js";
import { formatVND } from "../../../lib/money.js";
import { useCart } from "../../../context/CartContext.jsx";
import "./SearchResults.css";

export default function SearchResults() {
  const location = useLocation();
  const cart = useCart();

  const query = new URLSearchParams(location.search).get("q") || "";
  const normalized = query.trim().toLowerCase();

  const allItems = useMemo(
    () =>
      MENU_SECTIONS.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          sectionName: section.category,
        }))
      ),
    []
  );

  const results =
    normalized.length === 0
      ? []
      : allItems.filter((item) =>
          item.name.toLowerCase().includes(normalized)
        );

  return (
    <>
      <Header />
      <main className="searchPage">
        <div className="container">
          <header className="searchPage__header">
            <p className="searchPage__eyebrow">Search results</p>
            <h1 className="searchPage__title">
              {normalized
                ? `Found ${results.length} cake${
                    results.length !== 1 ? "s" : ""
                  } for “${query}”`
                : "Please enter a cake name"}
            </h1>
            <p className="searchPage__actions">
              <Link to="/menu">Browse full menu →</Link>
            </p>
          </header>

          {normalized && results.length === 0 && (
            <div className="searchPage__empty">
              <p>No cakes match that keyword. Try another name?</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="searchPage__grid">
              {results.map((item) => (
                <article key={item.id} className="searchCard">
                  <div className="searchCard__thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="searchCard__body">
                    <p className="searchCard__category">{item.sectionName}</p>
                    <h3>{item.name}</h3>
                    <p className="searchCard__price">
                      {item.price ? formatVND(item.price) : "Contact us"}
                    </p>
                  </div>
                  <button
                    className="searchCard__btn"
                    onClick={() => cart.add(item)}
                  >
                    Add to cart
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}