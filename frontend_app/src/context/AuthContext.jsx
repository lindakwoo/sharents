import React, { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [isGuardian, setIsGuardian] = useState(false);

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

    if (accessToken && storedUser) {
      setIsAuth(true);
      setUser(storedUser.user_id);
      setIsGuardian(storedUser.isGuardian);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuth, login, logout, user, isGuardian }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
