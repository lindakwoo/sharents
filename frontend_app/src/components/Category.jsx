import React from "react";
import { Box, styled } from "@mui/material";

const Category = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.info.main, // You can customize this color
  color: theme.palette.info.contrastText, // Text color
  padding: "16px",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "16px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds a shadow for emphasis
  width: "100px",
}));

export default Category;
