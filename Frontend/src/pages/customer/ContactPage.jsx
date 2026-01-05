import Header from "../../components/common/Header/Header.jsx";
import Footer from "../../components/common/Footer/Footer.jsx";
import "./StaticPage.css";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="staticPage">
        <div className="container staticPage__inner">
          <p className="staticPage__eyebrow">Contact & Order</p>
          <h1>Talk to our cake concierge</h1>
          <p>Hotline: <strong>+84 123456789</strong> (7am – 11pm)</p>
          <p>Email: <strong>sweetbakery@gmail.com</strong></p>
          <p>
            For large quantity or corporate orders, drop a note at
            orders@sweetbakery.com and we’ll reply within 24h.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}