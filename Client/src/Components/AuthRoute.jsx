// Components/AuthRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("member"));

  if (token && user) {
    const redirectPath =
      user.role === "admin" || user.role === "co-admin"
        ? "/admin"
        : "/dashboard/personal-info";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
