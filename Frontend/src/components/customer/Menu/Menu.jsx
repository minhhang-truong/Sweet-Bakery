
import "./Menu.css";
import { getMenu } from "../../../data/menuData.js";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext.jsx";
import { formatVND } from "../../../lib/money";
import { useEffect, useState } from "react";

export default function MenuSection({ anchorId = "home-menu" }) {
  const [sections, setSections] = useState([]);
  const cart = useCart();
  const nav = useNavigate();

  useEffect(() => {
    async function loadMenu() {
      const menuData = await getMenu(); // get cached or fetch
      setSections(menuData);
    }
    loadMenu();
  }, []);

  return (
    <section className="menu" id={anchorId}>
      <div className="container">
        <h2 className="menu__title">OUR MENU</h2>

        {sections.map((section) => (
          <div key={section.slug} className="menu__category">
            <div className="menu__categoryBar">
              <span className="dot" />
              <h3 className="menu__categoryTitle">{section.category}</h3>
            </div>

            <div className="menu__grid">
              {section.items.slice(0, 4).map((item) => (
                <article
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  className="menu__card"
                >
                  <div className="menu__thumbWrap">
                    <img className="menu__img" src={item.image} alt={item.name} />
                  </div>
                  <h4 className="menu__name">{item.name}</h4>
                  <p className="menu__price">Price: {formatVND(item.price)}</p>

                  <div className="menu__row">
                    <button
                      className="menu__btn"
                      onClick={() => cart.add(item)}
                    >
                      Add to cart
                    </button>
                    <button
                      className="menu__btnSecondary"
                      onClick={() => { cart.add(item); nav("/cart"); }}
                    >
                      Buy now
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="menu__seeMoreWrap">
              <Link to={`/menu/${section.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="menu__seeMore">
                See more <span className="chev">˅</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
