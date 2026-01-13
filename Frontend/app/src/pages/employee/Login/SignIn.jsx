import "./SignIn.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import axios from "axios";
import logoImg from '../../../assets/images/common/logo-sweet-bakery.png';
import { message } from "antd";

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

    if (!email.trim() || !pw.trim()) {
      setErr("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/employee/auth/signin`, {
        email: email,
        password: pw,
      }, {withCredentials: true});

      console.log("Login success:", res.data);
      const user = res.data.user;

      // SỬA: Check role là string 'staff'
      if (user.role !== 'staff') {
          setErr("Unauthorized: Only employees can login here.");
          return;
      }

      // Lưu user vào localStorage
      localStorage.setItem("auth:user:v1", JSON.stringify(user));
      
      if(auth.login) auth.login(user);

      message.success("Login successful");
      navigate("/employee");

    } catch (error) {
      console.error(error);
      if (error.response) {
        setErr(error.response.data.error || "Login failed");
      } else {
        setErr("Unable to connect to server");
      }
    }
  }

  return (
    <main className="signin">
      <div className="signin__card">
        <img className="signin__logo" src={logoImg} alt="Sweet Bakery" />
        <h1 className="signin__title">Employee Portal</h1>

        <form onSubmit={onSubmit} className="signin__form">
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

          <label className="field">
            <span className="field__icon" aria-hidden>🔒</span>
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <button type="button" className="field__icon" onClick={() => setShow(!show)} style={{border:'none', background:'none'}}>
                {show ? '👁️' : '🙈'}
            </button>
          </label>

          {err && <div className="signin__error">{err}</div>}

          <button type="submit" className="signin__btn">Sign in</button>
        </form>
        
        <div style={{marginTop: 15, fontSize: 13, color: '#666'}}>
            Are you a Manager? <Link to="/manager/signin" style={{color: '#d31111', fontWeight: 'bold'}}>Login here</Link>
        </div>
      </div>
    </main>
  );
}