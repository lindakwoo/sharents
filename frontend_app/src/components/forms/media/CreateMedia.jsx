import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

const Button = styled("button")({});

const CreateMedia = () => {
  const [mediaData, setMediaData] = useState({ description: "", category: "", date: "", type: "", url: "", child: "" });
  return <div>CreateMedia</div>;
};

export default CreateMedia;
