import React, { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import Login from "./forms/Login";
import GuardianSignup from "./forms/GuardianSignup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { H1 } from "./typography/Styled";

const Landing = () => {
  // This page has sign up and login buttons and is just a SHARENTS overview
  //   page with our logo and some marketing language
  const { isLogin, setIsLogin, isSignup, setIsSignup, user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(isLogin);
  const [signupModalOpen, setSignupModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleLoginClose = () => {
    setLoginModalOpen(false);
    setIsLogin(false);
  };

  const handleSignupClose = () => {
    setSignupModalOpen(false);
    setIsSignup(false);
  };

  useEffect(() => {
    setLoginModalOpen(isLogin);
  }, [isLogin]);

  useEffect(() => {
    setSignupModalOpen(isSignup);
  }, [isSignup]);

  useEffect(() => {
    if (user) {
      navigate("/member_landing");
    }
  }, [user]);

  return (
    <>
      {" "}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "128px" }}>
          <img src='./logo.png' />
          <Box sx={{ width: "50%" }}>
            <H1 sx={{ fontSize: "64px" }}>Welcome to Sharents</H1>
            <Box sx={{ fontSize: "32px" }}>Share your children's milestones and memories with all your loved ones</Box>
          </Box>
        </Box>
      </Box>
      <Login open={loginModalOpen} handleClose={handleLoginClose} />
      <GuardianSignup open={signupModalOpen} handleClose={handleSignupClose} />
    </>
  );
};

export default Landing;
