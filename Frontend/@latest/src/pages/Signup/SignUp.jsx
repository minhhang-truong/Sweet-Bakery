import "./SignUp.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !email.trim() || !pw.trim() || !pw2.trim()) {
      setErr("Please fill in all fields.");
      return;
    }
    if (pw.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (pw !== pw2) {
      setErr("Passwords do not match.");
      return;
    }
    if (!agree) {
      setErr("Please agree to the Terms & Privacy.");
      return;
    }
    // TODO: call API signup here
     try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password: pw,
        name,
      });

      console.log("Signup success:", res.data);

      navigate("/signin"); // sau khi đăng ký mock, chuyển sang Sign in
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setErr(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <main className="signup">
      <div className="signup__card">
        <img className="signup__logo" src="/logo.png" alt="Sweet Bakery" />
        <h1 className="signup__title">Sign up</h1>

        <form onSubmit={onSubmit} className="signup__form">
          <label className="field">
            <span className="field__icon" aria-hidden>🧁</span>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span className="field__suffix" />
          </label>

          <label className="field">
            <span className="field__icon" aria-hidden>📧</span>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="field__suffix" />
          </label>

          <label className="field">
            <span className="field__icon" aria-hidden>🔒</span>
            <input
              type={show ? "text" : "password"}
              placeholder="Create a password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={6}
            />
            <button type="button" className="field__suffix" onClick={() => setShow(s => !s)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? "🙈" : "👁️"}
            </button>
          </label>

          <label className="field">
            <span className="field__icon" aria-hidden>✅</span>
            <input
              type={show2 ? "text" : "password"}
              placeholder="Confirm password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
              minLength={6}
            />
            <button type="button" className="field__suffix" onClick={() => setShow2(s => !s)} aria-label={show2 ? "Hide password" : "Show password"}>
              {show2 ? "🙈" : "👁️"}
            </button>
          </label>

          <label className="agree">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>I agree to the <a href="#">Terms</a> & <a href="#">Privacy</a>.</span>
          </label>

          {err && <div className="signup__error">{err}</div>}

          <button type="submit" className="signup__btn">Create account</button>
        </form>

        <p className="signup__hint">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
