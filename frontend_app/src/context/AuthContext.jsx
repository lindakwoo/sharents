import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const login = (access, user, role) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", JSON.stringify(role));
    setIsAuth(true);
    setUser(user);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsAuth(false);
    setUser(null);
    setRole("");
    navigate("/member_landing");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = JSON.parse(localStorage.getItem("role"));
    console.log("accessToken", accessToken);

    if (accessToken && storedUser) {
      // fetch the endpoint that validates the current accessToken is still valid...

      console.log("access", accessToken);
      console.log(storedUser);
      setIsAuth(true);
      setUser(storedUser);
      setRole(storedRole || false);
    } else {
      // Redirect to login if not authenticated
      // navigate("/member_signup");
    }
  }, [navigate]);

  console.log(isAuth);

  return <AuthContext.Provider value={{ isAuth, login, logout, user, role }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
