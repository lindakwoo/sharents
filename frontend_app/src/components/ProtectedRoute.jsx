import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isGuardian } = useContext(AuthContext);

  if (!isGuardian) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
