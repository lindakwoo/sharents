import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, styled, Modal } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Button = styled("button")({});

function Login({ open, handleClose }) {
  const [userData, setUserData] = useState({ username: "", password: "" });
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
      // hard code for now until Caleb does his thing...
      login("some Access token", "66bf74d0e463457278b2ea36", "guardian");
      navigate("/member_landing");
      // const response = await axios.post("http://localhost/auth/token/", user, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // login(response.data.access_token, response.data.user, response.data.role); // set the access token and user in the local storage and context
    } catch (error) {
      console.log("Error logging in: " + error.response.data.detail);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: "50%",
          backgroundColor: "white",
          padding: 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          borderRadius: 2,
        }}
        className='shadow p-4 mt-4'
      >
        <Box sx={{ width: "100%" }} className='shadow p-4 mt-4'>
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
    </Modal>
  );
}

export default Login;
