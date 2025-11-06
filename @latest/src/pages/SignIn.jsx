import "./SignIn.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // ✅ mock validate đơn giản
    if (!email.trim() || !pw.trim()) {
      setErr("Please enter email and password");
      return;
    }
    // TODO: gọi API thật ở đây
    // giả sử đăng nhập OK:
    auth.login ({email});
    navigate("/"); // quay lại Home
  }

  return (
    <main className="signin">
      <div className="signin__card">
        <img className="signin__logo" src="/logo.png" alt="Sweet Bakery" />
        <h1 className="signin__title">Sign in</h1>

        <form onSubmit={onSubmit} className="signin__form">
          {/* Email */}
          <label className="field">
            <span className="field__icon" aria-hidden>👤</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password */}
          <label className="field">
            <span className="field__icon" aria-hidden>🔒</span>
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <button
              type="button"
              className="field__suffix"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow(s => !s)}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </label>

          {err && <div className="signin__error">{err}</div>}

          <button type="submit" className="signin__btn">Sign in</button>
        </form>

        <p className="signin__hint">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
