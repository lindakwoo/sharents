import React, { useState, useContext, useEffect } from "react";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";

const Img = styled("img")({});

const HomeHero = () => {
  const { child } = useContext(ChildContext);
  const getAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const ageInMilliseconds = today - birthDate;
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    return ageInYears;
  };

  const age = getAge(child.birthdate);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Img sx={{ width: "50%" }} src={child.profile_picture} />
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <Box>{child.name}</Box>
        <Box>{age} years old</Box>
      </Box>
    </Box>
  );
};

export default HomeHero;
