import React from "react";
import { Box } from "@mui/material";
import { formatDate } from "../../utils";
import Category from "../Category";
import { StyledLink } from "../typography/Styled";

const MilestoneBox = ({ milestone }) => {
  return (
    <Box
      sx={{
        transition: "transform 0.3s ease-in-out", // Smooth transition
        "&:hover": {
          transform: "scale(1.1)", // Grow the image to 110% of its original size on hover
        },
      }}
    >
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
          }}
        >
          {milestone.category}
        </Category>

        <Box sx={{ mt: "16px" }}>{formatDate(milestone.date, false)}</Box>

        <h1>{milestone.name}</h1>
      </StyledLink>
    </Box>
  );
};

export default MilestoneBox;
