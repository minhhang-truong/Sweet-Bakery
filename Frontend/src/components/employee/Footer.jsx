import "../../pages/employee/ManagementLayout.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo-section">
        <h2 style={{ margin: 0, fontFamily: "cursive" }}>
          Sweet Bakery
        </h2>
        <p>No 1 Dai Co Viet, Hai Ba Trung, Ha Noi</p>
        <p>+84 123456789</p>
      </div>

      <div className="footer-links">
        <p>Home | Menu | About Us</p>
        <p>© 2025 Savor Cake. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
