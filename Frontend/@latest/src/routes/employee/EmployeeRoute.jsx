import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeRoute({ children }) {
  const auth = useAuth();

  // Chưa đăng nhập → vẫn cho vào (guest)
  if (!auth.isAuthed) return children;

  // Nếu là employee → chặn
  if (auth.user.role === 1) return <Navigate to="/" replace />;

  // Nếu là manager → chặn
  if (auth.user.role === 3) return <Navigate to="/manager/dashboard" replace />;

  // Nếu là customer → cho phép
  return children;
}
