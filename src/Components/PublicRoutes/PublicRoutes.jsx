import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  console.log(token);

  if (!token) {
    return children;
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default PublicRoute;
