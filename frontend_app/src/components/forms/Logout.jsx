import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("token", refreshToken);
    try {
      const response = await axios.post(
        "http://localhost:8000/logout/",
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      logout();
      alert("Logout successful!");
      navigate("/");
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.detail || "Unknown error";
      alert(`Error logging out: ${errorMessage}`);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
