import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ token, role, allowedRoles, children }) => {
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoutes;
