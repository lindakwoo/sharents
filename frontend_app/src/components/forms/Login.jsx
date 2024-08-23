import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Button = styled("button")({});

function Login() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(userData);
    e.preventDefault();
    try {
      login("some Access token", "66bf74d0e463457278b2ea36", "guardian");
      navigate("/member_landing");
      // const response = await axios.post("http://localhost/auth/token/", user, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // login(response.data.access_token, response.data.user, response.data.role); // set the access token and user in the local storage and context
      // setMessage("Login successful!");
      // navigate("/");
    } catch (error) {
      setMessage("Error logging in: " + error.response.data.detail);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: "128px" }}>
      <Box sx={{ width: "40%" }} className='shadow p-4 mt-4'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Username</label>
            <input
              type='text'
              className='form-control'
              value={userData.username}
              name='username'
              onChange={(e) => handleChange(e)}
              placeholder='Enter username'
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Password</label>
            <input
              type='password'
              className='form-control'
              value={userData.password}
              name='password'
              onChange={(e) => handleChange(e)}
              placeholder='enter password'
            />
          </Box>

          <Button
            sx={{
              mt: "16px",
            }}
            type='submit'
            className='btn btn-primary'
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
