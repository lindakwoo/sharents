import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils";
import Category from "../Category";

const Span = styled("span")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const MilestoneBox = ({ milestone }) => {
  return (
    <StyledLink
      sx={{
        height: "150px",
        width: "50vw",
        backgroundColor: "#b5d4f6",
        color: "black",
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
      to={`/milestones/${milestone.id}`}
    >
      <Category
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "100px",
        }}
      >
        {milestone.category}
      </Category>

      <Box sx={{ mt: "16px" }}>{formatDate(milestone.date, false)}</Box>

      <h1>{milestone.name}</h1>
    </StyledLink>
  );
};

export default MilestoneBox;
