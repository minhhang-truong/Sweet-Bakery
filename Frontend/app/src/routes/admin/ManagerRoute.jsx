import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ManagerRoute({ children }) {
  const auth = useAuth();

  // Chưa đăng nhập -> đá về trang login admin
  if (!auth.isAuthed) return <Navigate to="/manager/signin" replace />;

  // Nếu là nhân viên -> đá về trang nhân viên
  if (auth.user.role === 'staff') return <Navigate to="/employee" replace />;

  // Nếu là khách hàng -> đá về trang chủ
  if (auth.user.role === 'customer') return <Navigate to="/" replace />;

  // Nếu là admin -> cho phép
  return <>{children}</>;
}