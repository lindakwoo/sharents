import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import MilestoneBox from "./MilestoneBox";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const { child } = useContext(ChildContext);

  const fetchMilestones = async () => {
    const url = `http://localhost/api/milestones/children/${child.id}`;
    try {
      const response = await customFetch(url);
      const processedMilestones = response.milestones.map((milestone) => ({
        ...milestone,
        created_at: new Date(milestone.created_at), // Convert to Date object
      }));
      processedMilestones.sort((a, b) => b.created_at - a.created_at);

      setMilestones(processedMilestones);
    } catch (error) {
      console.error("Error fetching milestones", error);
    }
  };

  useEffect(() => {
    fetchMilestones(); // Fetch milestone when id changes
  }, [child]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
        padding: "64px",

        backgroundColor: "#f8f8f8",
      }}
    >
      {" "}
      <h1>All Milestones</h1>{" "}
      {milestones.map((milestone) => (
        <MilestoneBox key={milestone.id} milestone={milestone} />
      ))}
    </Box>
  );
};

export default MilestonesPage;
