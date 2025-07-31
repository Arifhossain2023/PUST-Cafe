import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return <Navigate to={`/login/${role}`} replace />;

  const user = JSON.parse(storedUser);
  if (user.role !== role) return <Navigate to={`/login/${role}`} replace />;

  return children;
};

export default ProtectedRoute;
