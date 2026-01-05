
import "./WhyChoose.css";

const FEATURES = [
  {
    icon: "https://www.svgrepo.com/show/427343/cake-sweet.svg",
    title: "A Wide Variety of Fresh Fruits",
    text:
      "10+ types: logan, lychee, grapes, strawberries, avocado, mango, cherry...",
    variant: "outline",
  },
  {
    icon: "https://www.svgrepo.com/show/420206/cake-christmas-dessert.svg",
    title: "Fast Delivery within 1 Hour",
    text:
      "Freshly made and shipped right after you order. No deposit for COD. Free shipping from 350k.",
    variant: "filled",
  },
  {
    icon: "https://www.svgrepo.com/show/421031/bow-cake-gift.svg",
    title: "Cakes for Every Occasion",
    text:
      "Sizes for 2–20 people. 150+ designs for birthdays, events, and parties.",
    variant: "outline",
  },
  {
    icon: "https://www.svgrepo.com/show/475566/fruit.svg",
    title: "ISO 22000:2018 Certified",
    text:
      "Food safety guaranteed. Customer support 7AM–11PM.",
    variant: "filled",
  },
];

export default function WhyChoose() {
  return (
    <section className="why">
      <div className="container why__inner">
        {/* Left text block */}
        <div className="why__copy">
          <h2 className="why__title">
            Why Choose <span>Savor Cake?</span>
          </h2>
          <p className="why__subtitle">
            Discover what makes Savor Cake truly special!
          </p>
        </div>

        {/* Right cards frame */}
        <div className="why__frame">
          <div className="why__cards">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className={`why__card ${f.variant === "filled" ? "is-filled" : "is-outline"}`}
              >
                <div className="why__icon">
                  {/* Tạm thời dùng img; bạn có thể thay bằng SVG inline */}
                  <img src={f.icon} alt="" aria-hidden="true" />
                </div>
                <h3 className="why__cardTitle">{f.title}</h3>
                <p className="why__cardText">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
