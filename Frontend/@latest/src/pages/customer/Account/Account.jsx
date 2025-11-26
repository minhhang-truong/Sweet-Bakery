import "./Account.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Header from '../../../components/common/Header/Header.jsx';
import Footer from '../../../components/common/Footer/Footer.jsx';
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Account() {
  const auth = useAuth();
  const nav = useNavigate();

  // Nếu chưa đăng nhập → về /signin
  useEffect(() => {
    async function fetchProfile() {
      try {
        // const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/auth/${auth.user.id}`, {
          withCredentials: true,
        });

        // cập nhật form bằng dữ liệu từ DB
        setForm({
          name: res.data.fullname,
          email: res.data.email,
          phone: res.data.phone || "",
          address: res.data.address || "",
        });

      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    if (auth.isAuthed) {
      fetchProfile();
    }
  }, [auth.isAuthed]);

  const [form, setForm] = useState({
    name: auth.user.name || "",
    email: auth.user.email || "",
    // ✅ HIỂN THỊ MẬT KHẨU HIỆN TẠI TỪ auth.user (theo yêu cầu)
    password: auth.user.password || "", 
    phone: auth.user.phone || "",
    address: auth.user.address || "",
  });

  async function submit(e) {
    e.preventDefault();
    await auth.updateProfile(form);
  }

  if (!auth.isAuthed) {
    return (
      <>
        <Header />
        <main className="account account--empty">
          <div className="container">
            <h1>Redirecting…</h1>
            <p>We are taking you to the sign-in page.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  function handleLogout() {
    auth.logout();
    nav("/");
  }

  return (
    <>
      <Header />
      <main className="account">
        <div className="container">
          <h1 className="acc__title">My Account</h1>

          <div className="acc__grid">
            <section className="acc__card">
              <h2 className="acc__cardTitle">Profile</h2>
              <form onSubmit={submit} className="acc__form">
                <label>
                  <span>Full name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </label>

                {/* ✅ Ô PASSWORD: type="text" để luôn hiển thị rõ */}
                <label>
                  <span>Password</span>
                  <input
                    type="text" 
                    placeholder="Enter new password"
                    value={form.password} 
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </label>
                {/* --------------------- */}

                <label>
                  <span>Phone</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </label>
                <label className="full">
                  <span>Address</span>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </label>

                <div className="acc__actions">
                  <button type="submit" className="acc__btn">
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      auth.logout();
                      nav("/");
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </form>
            </section>

            <aside className="acc__side">
              <section className="acc__card">
                <h2 className="acc__cardTitle">Quick links</h2>
                <ul className="acc__list">
                  <li>
                    <Link to="/cart">View cart</Link>
                  </li>
                  <li>
                    <Link to="/menu">Shop more</Link>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
