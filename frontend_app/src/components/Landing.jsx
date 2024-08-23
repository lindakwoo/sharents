import React, { useEffect, useState, useContext } from "react";
import { Box, styled } from "@mui/material";
import Login from "./forms/Login";
import { AuthContext } from "../context/AuthContext";

const Landing = () => {
  // This page has sign up and login buttons and is just a SHARENTS overview
  //   page with our logo and some marketing language
  const { isLogin, setIsLogin } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(isLogin);

  const handleClose = () => setModalOpen(false);
  setIsLogin(false);

  useEffect(() => {
    setModalOpen(isLogin);
  }, [isLogin]);

  useEffect(() => {
    setModalOpen(isSignup);
  }, [isSignup]);

  return (
    <>
      {" "}
      <h1>Sharents Landing Page</h1>
      <Login open={modalOpen} handleClose={handleClose} />
    </>
  );
};

export default Landing;
