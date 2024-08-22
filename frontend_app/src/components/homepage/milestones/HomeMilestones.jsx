import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { ChildContext } from "../../../context/ChildContext";
import HomeMilestone from "./HomeMilestone";
import { Box, styled } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeMilestones = () => {
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

      const topThreeMilestones = processedMilestones.slice(0, 3);
      setMilestones(topThreeMilestones);
    } catch (error) {
      console.error("Error fetching milestones", error);
      setMilestones([]);
    }
  };

  useEffect(() => {
    fetchMilestones(); // Fetch milestone when id changes
  }, [child]);

  return (
    <Box
      sx={{
        backgroundColor: "#f8f8f8",
        padding: "64px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          left: "0",
          width: "100%",
          height: "100px", // Height of the arc at the top
          backgroundColor: "white", // Match the background color of the div
          borderRadius: "0 0 50% 50%",
          zIndex: 300,
        }}
      ></Box>
      <Box
        sx={{
          content: '""',
          position: "absolute",
          bottom: "-50px",
          left: "-200px",
          width: "150%",
          height: "200px", // Height of the arch
          backgroundColor: "white", // Match the background color of the div
          borderRadius: "70% 70% 0 0", // Arched bottom effect
          transform: "translateY(50%)",
          zIndex: 300,
        }}
      ></Box>
      <Box
        sx={{
          width: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Latest milestones</h1>
        <Box
          sx={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "1fr 1fr 1fr",
            marginTop: "32px",
            marginBottom: "64px",
          }}
        >
          {milestones.map((milestone) => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <HomeMilestone key={milestone.id} milestone={milestone} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", alignSelf: "end" }}>
        <StyledLink to='/milestones' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
          All milestones <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
        </StyledLink>
      </Box>
    </Box>
  );
};

export default HomeMilestones;
