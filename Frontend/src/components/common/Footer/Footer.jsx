import "./Footer.css";
import { Link } from "react-router-dom";
import logoImg from '../../../assets/images/common/logo-sweet-bakery.png';
import badge from '../../../assets/images/common/badge.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      {/* Red footer */}
      <section className="ftMain">
        <div className="container ftGrid">
          {/* Brand & address */}
          <div className="ftBrand">
            <img className="ftLogo" src={logoImg} alt="Sweet Bakery" />
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
              <li><Link to="/menu" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Menu / Products</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>About Us</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Contact / Order</Link></li>
              <li><Link to="/faq" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>FAQ / Policy</Link></li>
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
            <img className="ftBadge" src={badge} alt="Certification badge" />
          </div>
        </div>

        <div className="ftCopy">
          © {year} Savor Cake. All rights reserved.
        </div>
      </section>
    </footer>
  );
}