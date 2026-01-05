import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CustomerRoute({ children }) {
  const auth = useAuth();

  // Chưa đăng nhập → vẫn cho vào (guest)
  if (!auth.isAuthed) return children;

  // Nếu là employee → chặn
  if (auth.user.role === 2) return <Navigate to="/employee" replace />;

  // Nếu là manager → chặn
  if (auth.user.role === 3) return <Navigate to="/manager/dashboard" replace />;

  // Nếu là customer → cho phép
  return children;
}
