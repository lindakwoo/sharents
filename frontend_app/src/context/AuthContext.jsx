import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [isGuardian, setIsGuardian] = useState(false);
  const navigate = useNavigate();

  const login = (access, user, isGuardian) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuth(true);
    setUser(user);
    setIsGuardian(isGuardian);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuth(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("accessToken", accessToken);

    if (accessToken && storedUser) {
      // fetch the endpoint that validates the current accessToken is still valid...

      console.log("access", accessToken);
      console.log(storedUser);
      setIsAuth(true);
      setUser(storedUser);
      setIsGuardian(storedUser.isGuardian);
    } else {
      // Redirect to login if not authenticated
      navigate.push("/login");
    }
  }, [navigate]);

  console.log(isAuth);

  return <AuthContext.Provider value={{ isAuth, login, logout, user, isGuardian }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
