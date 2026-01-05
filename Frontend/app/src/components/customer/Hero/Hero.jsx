import "./Hero.css";
import hero from "../../../assets/images/customer/hompage/hero.jpg"

export default function Hero() {
  const scrollToMenu = () => {
    const el = document.getElementById("home-menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__bg" src={hero} alt="" aria-hidden="true" />
      <div className="container hero__inner">
        <h1 id="hero-title" className="hero__title">
          <span>Welcome to</span>
          <br />
          <strong>Sweet Bakery</strong>
        </h1>
        <p className="hero__sub">where every bite brings a smile!</p>
        <button className="hero__cta" onClick={scrollToMenu}>
          Order now!
        </button>
      </div>
    </section>
  );
}