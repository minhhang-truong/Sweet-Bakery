import Header from "../../components/common/Header/Header.jsx";
import Footer from "../../components/common/Footer/Footer.jsx";
import "./StaticPage.css";

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="staticPage">
        <div className="container staticPage__inner">
          <p className="staticPage__eyebrow">FAQ & Policy</p>
          <h1>Questions we get the most</h1>
          <ul className="staticPage__list">
            <li>
              <strong>How long does delivery take?</strong>
              <p>Within Hanoi we deliver in 1–2 hours, nationwide in 1 day.</p>
            </li>
            <li>
              <strong>Do you accept last minute orders?</strong>
              <p>Yes. Call us before 7pm and we will confirm availability.</p>
            </li>
            <li>
              <strong>What is the refund policy?</strong>
              <p>Any product defect reported within 2 hours will be replaced.</p>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}