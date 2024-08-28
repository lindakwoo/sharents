import React, { useState, useContext, useEffect } from "react";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { getAge } from "../../utils";

const Img = styled("img")({});
const H1 = styled("h1")({});
const H2 = styled("h2")({});

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
        my: "64px",
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
        px: "32px",
      }}
    >
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <Img sx={{ height: "350px" }} src={child.profile_picture} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            width: "100%",
          }}
        >
          <H1 sx={{ fontSize: "64px", fontWeight: "bold", color: "#0088d1" }}>{child.name}</H1>

          <h2>
            {years} {months}
          </h2>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
            {child.favorite_color && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "start" }}>
                <H2 sx={{ whiteSpace: "nowrap" }}>Favorite color: </H2>
                <Box sx={{ fontSize: "24px", ml: "16px" }}>{child.favorite_color}</Box>
              </Box>
            )}
            {child.current_thing && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "start" }}>
                {" "}
                <H2 sx={{ whiteSpace: "nowrap" }}>Latest Thing: </H2>
                <Box sx={{ fontSize: "24px", ml: "16px" }}>{child.current_thing}</Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeHero;
