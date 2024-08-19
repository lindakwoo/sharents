import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [isGuardian, setIsGuardian] = useState(false);

  const login = (access, user_id, isGuardian) => {
    localStorage.setItem("access_token", access);
    setIsAuth(true);
    setUser(user_id);
    setIsGuardian(isGuardian);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuth(false);
  };

  return <AuthContext.Provider value={{ isAuth, login, logout, user, isGuardian }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
