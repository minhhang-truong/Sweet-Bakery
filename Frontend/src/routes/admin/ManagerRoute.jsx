import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ManagerRoute({ children }) {
  const auth = useAuth();

  // Chưa đăng nhập → vẫn cho vào (guest)
  // if (!auth.isAuthed) return children;
  if (!auth.isAuthed) return <Navigate to="/manager/signin" replace />;

  // Nếu là employee → chặn
  if (auth.user.role === 2) return <Navigate to="/employee" replace />;

  // Nếu là customer → chặn
  if (auth.user.role === 1) return <Navigate to="/" replace />;

  // Nếu là manager → cho phép
  return <>{children}</>;
}