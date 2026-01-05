import "./ChangePassword.css";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from '../../../components/common/Header/Header.jsx';
import Footer from '../../../components/common/Footer/Footer.jsx';
import api from '../../../lib/axiosCustomer.js';
import { message } from "antd";

export default function ChangePassword() {
  const auth = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (!auth.isAuthed) {
    return (
      <>
        <Header />
        <main className="change-password change-password--empty">
          <div className="container">
            <h1>Redirecting…</h1>
            <p>We are taking you to the sign-in page.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password");
      setLoading(false);
      return;
    }

    try {
      await api.put(
        `/auth/change-password/${auth.user.id}`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        },
      );

      setSuccess(true);
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Auto redirect after 2 seconds
      message.success("Password changed successfully. Please sign in again.");
      
      setTimeout(() => {
        auth.logout();
        nav("/signin");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="change-password">
        <div className="container">
          <h1 className="cp__title">Change Password</h1>

          <div className="cp__content">
            <section className="cp__card">
              <h2 className="cp__cardTitle">Update your password</h2>
              
              {success && (
                <div className="cp__success">
                  Password changed successfully! Redirecting to account page...
                </div>
              )}

              {error && (
                <div className="cp__error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="cp__form">
                <label>
                  <span>Current password</span>
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                    required
                  />
                </label>

                <label>
                  <span>New password</span>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Enter new password (min 6 characters)"
                    required
                    minLength={6}
                  />
                </label>

                <label>
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    required
                    minLength={6}
                  />
                </label>

                <div className="cp__actions">
                  <button 
                    type="submit" 
                    className="cp__btn"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change password"}
                  </button>
                  <button
                    type="button"
                    className="cp__btn cp__btn--secondary"
                    onClick={() => nav("/")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>

            <aside className="cp__side">
              <section className="cp__card">
                <h2 className="cp__cardTitle">Password requirements</h2>
                <ul className="cp__list">
                  <li>At least 6 characters long</li>
                  <li>Different from your current password</li>
                  <li>Use a combination of letters and numbers for better security</li>
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
