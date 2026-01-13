import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CustomerRoute({ children }) {
  const auth = useAuth();

  // Nếu chưa đăng nhập: Vẫn cho render children.
  // (Lý do: Các trang như HomePage, Menu ai cũng xem được. 
  // Riêng trang Account/Checkout thì bên trong component đó đã có logic tự đá về login nếu chưa authed)
  if (!auth.isAuthed) return children;

  // Nếu là nhân viên -> đá về trang nhân viên
  if (auth.user.role === 'staff') return <Navigate to="/employee" replace />;

  // Nếu là admin -> đá về dashboard admin
  if (auth.user.role === 'admin') return <Navigate to="/manager/dashboard" replace />;

  // Nếu là customer -> cho phép
  return children;
}