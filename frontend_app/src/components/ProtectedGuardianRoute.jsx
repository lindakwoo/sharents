import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedGuardianRoute = ({ component: Component, ...rest }) => {
  const { role } = useContext(AuthContext);

  if (role === "member" || role === "") {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};

export default ProtectedGuardianRoute;
