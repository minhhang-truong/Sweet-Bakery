import "./SignIn.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import axios from "axios";
import logoImg from '../../../assets/images/common/logo-sweet-bakery.png';
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // ✅ mock validate đơn giản
    if (!email.trim() || !pw.trim()) {
      setErr("Please enter email and password");
      return;
    }
    // TODO: gọi API thật ở đây
    console.log(API_URL)
    try {
      const res = await axios.post(`${API_URL}/manager/auth/signin`, {
        email: email,
        password: pw,
      }, {withCredentials: true});

      console.log("Login success:", res.data);
      // localStorage.setItem("token", res.data.token); // Save JWT token
      await auth.login(res.data.user);
      if (redirect) {
        navigate(`/${redirect}`);
        return;
      }
      if (res.data.user.role == 2) navigate("/employee", {replace: true});
      else if (res.data.user.role == 3) navigate("/manager/dashboard");
      else navigate("/", { replace: true });
    } catch (err) {
      if (err.response) {
        // Response came from backend with an error message
        setErr(err.response.data.error || "Login failed");
      } else {
        // Network or unexpected error
        setErr("Unable to connect to server");
      }
    }
  }

  return (
    <main className="signin">
      <div className="signin__card">
        <img className="signin__logo" src={logoImg} alt="Sweet Bakery" />
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
