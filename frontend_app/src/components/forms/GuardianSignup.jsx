import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, styled, Modal } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Button = styled("button")({});

const GuardianSignup = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setError("passwords do not match");
      return;
    }
    try {
      // hard code for now until Caleb does his thing...
      login("some Access token", "66bf74d0e463457278b2ea36", "guardian");
      navigate("/member_landing");
      // const response = await axios.post("http://localhost:8000/signup/", user, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // login(response.data.access_token, response.data.user, response.data.role);
    } catch (error) {
      console.log("Error signing in: " + error.response.data.detail);
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
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                mt: "16px",
              }}
              className='form-group'
            >
              <label>Name</label>
              <input
                type='text'
                name='name'
                className='form-control'
                value={user.name}
                onChange={handleChange}
                placeholder='Name'
                required
              />
            </Box>
            <Box
              sx={{
                mt: "16px",
              }}
              className='form-group'
            >
              <label>Username</label>
              <input
                type='text'
                name='username'
                className='form-control'
                value={user.username}
                onChange={handleChange}
                placeholder='Username'
                required
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
                className='form-control'
                type='password'
                name='password'
                value={user.password}
                onChange={handleChange}
                placeholder='Password'
                required
              />
            </Box>
            <Box
              sx={{
                mt: "16px",
              }}
              className='form-group'
            >
              <label>Confirm Password</label>
              <input
                className='form-control'
                type='password'
                name='confirmPassword'
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm Password'
                required
              />
            </Box>
            <Button
              sx={{
                mt: "16px",
              }}
              type='submit'
              className='btn btn-primary'
            >
              Signup
            </Button>
          </form>
        </Box>
        <Box>{error}</Box>
      </Box>
    </Modal>
  );
};

export default GuardianSignup;
