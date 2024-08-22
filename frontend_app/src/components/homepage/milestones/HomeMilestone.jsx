import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils";
import Category from "../../Category";
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeMilestone = ({ milestone }) => {
  return (
    <Box
      sx={{
        minHeight: "400px",
        backgroundColor: "#b5d4f6",
        width: "80%",
        padding: "64px",
        borderRadius: "10px",
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
          sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
          to={`/milestones/${milestone.id}`}
        >
          <Box>{formatDate(milestone.date)}</Box>

          <h1>{milestone.name}</h1>
        </StyledLink>
      </Box>
    </Box>
  );
};

export default HomeMilestone;
