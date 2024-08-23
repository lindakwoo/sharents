import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const GuardianSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ username: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/signup/", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      login(response.data.access, response.data.refresh);
      setMessage("User created successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data : error.message;
      setMessage("Error creating user: " + JSON.stringify(errorMessage));
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          value={user.username}
          onChange={handleChange}
          placeholder='Username'
          required
        />
        <input
          type='password'
          name='password'
          value={user.password}
          onChange={handleChange}
          placeholder='Password'
          required
        />
        <input
          type='password'
          name='confirmPassword'
          value={user.confirmPassword}
          onChange={handleChange}
          placeholder='Confirm Password'
          required
        />
        <button type='submit'>Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GuardianSignup;
