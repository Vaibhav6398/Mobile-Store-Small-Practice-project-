import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || parseInt(userId) !== 101) {
    return <Navigate to="/home" />;
  }

  return children;
}
