import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils";
import Category from "../../Category";
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});

const HomeMilestone = ({ milestone }) => {
  return (
    <Box
      sx={{
        minHeight: "400px",
        backgroundColor: "#b5d4f6",
        width: "80%",
        padding: "64px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: { xs: "center", lg: "start" },
        transition: "transform 0.3s ease-in-out", // Smooth transition
        "&:hover": {
          transform: "scale(1.1)", // Grow the image to 110% of its original size on hover
        },
      }}
    >
      <Category> {milestone.category}</Category>
      <Box
        sx={{
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <StyledLink
          sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", lg: "start" } }}
          to={`/milestones/${milestone.id}`}
        >
          <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>{formatDate(milestone.date)}</Box>

          <H1 sx={{ textAlign: { xs: "center", lg: "left" } }}>{milestone.name}</H1>
        </StyledLink>
      </Box>
    </Box>
  );
};

export default HomeMilestone;
