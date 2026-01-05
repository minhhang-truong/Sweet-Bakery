import Header from "../../components/common/Header/Header.jsx";
import Footer from "../../components/common/Footer/Footer.jsx";
import "./StaticPage.css";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="staticPage">
        <div className="container staticPage__inner">
          <p className="staticPage__eyebrow">About us</p>
          <h1>Sweet Bakery, since 2009</h1>
          <p>
            We bake everything from scratch with love and the freshest
            ingredients. Our pastry chefs design each cake like a piece of art
            for your birthday, wedding or corporate event. From signature tin
            box cakes to artisan cookies, Sweet Bakery delivers joy across
            Vietnam every day.
          </p>
          <p>
            Visit our flagship store at No 1 Dai Co Viet, Hai Ba Trung, or order
            online to enjoy contactless delivery within the day.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}