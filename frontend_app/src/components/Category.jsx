import React from "react";
import { Box, styled } from "@mui/material";

const Category = styled(Box)(({ theme, size }) => ({
  backgroundColor: theme.palette.info.main, // You can customize this color
  color: theme.palette.info.contrastText, // Text color
  padding: size === "small" ? "4px 8px" : "16px",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: size === "small" ? "12px" : "16px",
  fontWeight: "bold",
  marginBottom: size === "small" ? "8px" : "16px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds a shadow for emphasis
  width: size === "small" ? "80px" : "100px",
}));

export default Category;
