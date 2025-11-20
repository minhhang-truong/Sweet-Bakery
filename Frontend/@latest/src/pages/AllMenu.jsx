// src/pages/AllMenu.jsx
import { useParams, Link } from "react-router-dom";
import { MENU_SECTIONS, CATEGORIES } from "../data/menuData";
import "../components/Menu/Menu.css";

export default function AllMenu() {
  const { slug } = useParams();                 // e.g. "birthday-cake"
  const active = slug
    ? MENU_SECTIONS.find(s => s.slug === slug)
    : null;

  const title = active ? active.category : "All Products";
  const items = active
    ? active.items
    : MENU_SECTIONS.flatMap(s => s.items.map(it => ({ ...it, _section: s.category })));

  return (
    <section className="menu">
      <div className="container">
        <h2 className="menu__title">{title}</h2>

        {/* Tabs/filters để chuyển category nhanh */}
        <div style={{display:"flex", gap:8, flexWrap:"wrap", margin:"10px 0 20px"}}>
          <Link to="/menu" className="menu__btn">All</Link>
          {CATEGORIES.map(c => (
            <Link key={c.slug} to={`/menu/${c.slug}`}
              className="menu__btn" style={{background: slug===c.slug ? "#d94a4a" : ""}}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className="menu__grid">
          {items.map((item, idx) => (
            <article key={idx} className="menu__card">
              <div className="menu__thumbWrap">
                <img className="menu__img" src={item.image} alt={item.name} />
              </div>
              <h4 className="menu__name">{item.name}</h4>
              {item.price && <p className="menu__price">Price: {item.price}</p>}
              <button className="menu__btn">Order now</button>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <Link to="/" className="menu__back">← Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
