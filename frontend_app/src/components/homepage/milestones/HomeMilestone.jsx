import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
const Span = styled("span")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeMilestone = ({ milestone }) => {
  return (
    <Box sx={{ border: "solid, black, 1px", width: "80%" }}>
      <StyledLink to={`/milestone/${milestone.id}`}>
        <Box>{milestone.date}</Box>
        <Box>
          category: <Span sx={{ padding: "8px", backgroundColor: "yellow" }}>Food</Span>
        </Box>
        <Box>{milestone.name}</Box>
        <Box>{milestone.description}</Box>
      </StyledLink>
    </Box>
  );
};

export default HomeMilestone;
