import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils";
const Span = styled("span")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeMilestone = ({ milestone }) => {
  return (
    <Box
      sx={{
        minHeight: "300px",
        backgroundColor: "green",
        color: "white",
        width: "80%",
        padding: "64px",
        borderRadius: "10px",
      }}
    >
      <StyledLink sx={{ position: "relative" }} to={`/milestones/${milestone.id}`}>
        <Box
          sx={{
            position: "absolute",
            padding: "8px",
            backgroundColor: "yellow",
            color: "black",
            width: "100px",
            textAlign: "center",
            top: "-50px",
            left: "-50px",
          }}
        >
          {milestone.category}
        </Box>
        <Box>{formatDate(milestone.date)}</Box>

        <h1>{milestone.name}</h1>
      </StyledLink>
    </Box>
  );
};

export default HomeMilestone;
