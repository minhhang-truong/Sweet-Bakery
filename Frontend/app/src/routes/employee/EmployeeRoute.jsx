import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeRoute({ children }) {
  const auth = useAuth();

  // Chưa đăng nhập -> đá về trang login nhân viên
  if (!auth.isAuthed) return <Navigate to="/employee/signin" replace />;

  // Nếu là khách hàng -> đá về trang chủ
  if (auth.user.role === 'customer') return <Navigate to="/" replace />;

  // Nếu là admin -> đá về dashboard admin
  if (auth.user.role === 'admin') return <Navigate to="/manager/dashboard" replace />;

  // Nếu là staff -> cho phép
  return <>{children}</>;
}