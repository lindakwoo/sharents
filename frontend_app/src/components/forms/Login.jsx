import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(user);
    e.preventDefault();
    try {
      login("some Access token", "66bf74d0e463457278b2ea36", true);
      navigate("/home");
      // const response = await axios.post("http://localhost/auth/token/", user, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // login(response.data.access_token, { username: "linda woo" }); // set the access token and user in the local storage and context
      // setMessage("Login successful!");
      // navigate("/");
    } catch (error) {
      setMessage("Error logging in: " + error.response.data.detail);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* <input type='text' name='name' value={user.name} onChange={handleChange} placeholder='Name' required />
        <input type='email' name='email' value={user.email} onChange={handleChange} placeholder='Email' required /> */}
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
        <button type='submit'>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
