import React, { useEffect, useState, useContext } from "react";
import { Box, styled } from "@mui/material";
import Login from "./forms/Login";
import GuardianSignup from "./forms/GuardianSignup";
import { AuthContext } from "../context/AuthContext";

const Landing = () => {
  // This page has sign up and login buttons and is just a SHARENTS overview
  //   page with our logo and some marketing language
  const { isLogin, setIsLogin, isSignup, setIsSignup } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(isLogin);
  const [signupModalOpen, setSignupModalOpen] = useState(true);

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

  return (
    <>
      {" "}
      <h1>Sharents Landing Page</h1>
      <Login open={loginModalOpen} handleClose={handleLoginClose} />
      <GuardianSignup open={signupModalOpen} handleClose={handleSignupClose} />
    </>
  );
};

export default Landing;
