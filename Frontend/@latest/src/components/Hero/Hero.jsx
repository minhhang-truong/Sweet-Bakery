import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__bg" src="/hero.jpg" alt="" aria-hidden="true" />
      <div className="container hero__inner">
        <h1 id="hero-title" className="hero__title">
          <span>Welcome to</span>
          <br />
          <strong>Sweet Bakery</strong>
        </h1>
        <p className="hero__sub">where every bite brings a smile!</p>
        <button className="hero__cta">Order now!</button>
      </div>
    </section>
  );
}
