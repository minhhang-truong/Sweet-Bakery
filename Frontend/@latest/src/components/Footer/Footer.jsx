import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      {/* About band */}
      <section className="ftAbout">
        <div className="ftAbout__media">
          {/* Ảnh trái */}
          <img src="/images/about.png" alt="Cakes" />
        </div>

        <div className="ftAbout__content">
          <h2 className="ftAbout__title">About Us</h2>
          <p className="ftAbout__text">
            At Savor Cake, we believe every cake tells a story of love and
            happiness. We use the freshest ingredients, craft each design with
            care, and deliver sweetness that brightens every celebration.
          </p>
        </div>
      </section>

      {/* Red footer */}
      <section className="ftMain">
        <div className="container ftGrid">
          {/* Brand & address */}
          <div className="ftBrand">
            <img className="ftLogo" src="/logo.png" alt="Sweet Bakery" />
            <h3 className="ftBrandName">Sweet Bakery</h3>
            <ul className="ftList">
              <li>No 1 Dai Co Viet, Hai Ba Trung, Ha Noi, Vietnam</li>
              <li>+84 123456789</li>
              <li>sweetbakery@gmail.com</li>
              <li>Opening hours: 7am – 11pm</li>
            </ul>
          </div>

          {/* Links */}
          <nav className="ftCol">
            <h4 className="ftColTitle">Menu</h4>
            <ul className="ftList">
              <li><Link to="/menu">Menu / Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact / Order</Link></li>
              <li><Link to="/faq">FAQ / Policy</Link></li>
            </ul>
          </nav>

          {/* Social */}
          <nav className="ftCol">
            <h4 className="ftColTitle">Social</h4>
            <ul className="ftList">
              <li><a href="#" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">Tiktok</a></li>
            </ul>
          </nav>

          {/* Badge */}
          <div className="ftBadgeWrap">
            <img className="ftBadge" src="/images/badge.png" alt="Certification badge" />
          </div>
        </div>

        <div className="ftCopy">
          © {year} Savor Cake. All rights reserved.
        </div>
      </section>
    </footer>
  );
}
