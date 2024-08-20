import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { ChildContext } from "../../../context/ChildContext";
import HomeMilestone from "./HomeMilestone";
import { Box } from "@mui/material";

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
    }
  };

  useEffect(() => {
    fetchMilestones(); // Fetch milestone when id changes
  }, [child]);

  return (
    <Box>
      <h1>Latest milestones</h1>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: "32px", marginBottom: "64px" }}>
        {milestones.map((milestone) => (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <HomeMilestone key={milestone.id} milestone={milestone} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomeMilestones;
