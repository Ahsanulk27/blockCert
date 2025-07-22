import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
