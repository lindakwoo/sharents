import React, { useState, useContext, useEffect } from "react";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { getAge } from "../../utils";

const Img = styled("img")({});

const HomeHero = () => {
  const { child } = useContext(ChildContext);

  const age = getAge(child.birthdate);

  const years = age.years === 0 ? "" : age.years === 1 ? `${age.years} year and` : `${age.years} years and`;
  const months = age.months === 1 ? `${age.months} month old` : `${age.months} months old`;

  return (
    <Box
      sx={{
        zIndex: "relative",
        display: "flex",
        alignItems: "center",
        marginBottom: "64px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <Img sx={{ height: "350px" }} src={child.profile_picture} />
      </Box>
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <h1>{child.name}</h1>
        <h2>
          {years} {months}
        </h2>
      </Box>
    </Box>
  );
};

export default HomeHero;
