import "./Account.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Account() {
  const auth = useAuth();
  const nav = useNavigate();

  // Nếu chưa đăng nhập → về /signin
  useEffect(() => { if (!auth.isAuthed) nav("/signin"); }, [auth.isAuthed, nav]);

  if (!auth.isAuthed) return null;

  const [form, setForm] = useState({
    name: auth.user.name || "",
    email: auth.user.email || "",
    phone: auth.user.phone || "",
    address: auth.user.address || "",
  });

  function submit(e) {
    e.preventDefault();
    auth.updateProfile(form);
    alert("Profile updated!");
  }

  return (
    <main className="account">
      <div className="container">
        <h1 className="acc__title">My Account</h1>

        <div className="acc__grid">
          <section className="acc__card">
            <h2 className="acc__cardTitle">Profile</h2>
            <form onSubmit={submit} className="acc__form">
              <label>
                <span>Full name</span>
                <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}/>
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))}/>
              </label>
              <label>
                <span>Phone</span>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))}/>
              </label>
              <label className="full">
                <span>Address</span>
                <input value={form.address} onChange={e => setForm(f => ({...f, address:e.target.value}))}/>
              </label>

              <div className="acc__actions">
                <button type="submit" className="acc__btn">Save changes</button>
                <button type="button" className="acc__btnOutline" onClick={auth.logout}>Sign out</button>
              </div>
            </form>
          </section>

          <aside className="acc__side">
            <section className="acc__card">
              <h2 className="acc__cardTitle">Quick links</h2>
              <ul className="acc__list">
                <li><Link to="/cart">View cart</Link></li>
                <li><Link to="/menu">Shop more</Link></li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
