import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import MilestoneBox from "./MilestoneBox";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const Select = styled("select")({
  appearance: "none", // Remove default browser styling for select items
  width: "100%",
  padding: "8px 40px 8px 8px",
  borderRadius: "4px",
  background: `url('data:image/svg+xml;utf8,<svg fill="%23000000" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat`, // Custom dropdown arrow (enlarged)
  backgroundSize: "24px", // size of the icon
  backgroundPosition: "calc(100% - 4px) center", // Move icon 4px from the right
  backgroundColor: "white",
  fontSize: "16px",
});

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const { child } = useContext(ChildContext);
  const [category, setCategory] = useState("");
  const [filteredMilestones, setFilteredMilestones] = useState([]);

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
      setMilestones([]);
    }
  };

  const filterByCategory = () => {
    if (category === "") {
      setFilteredMilestones(milestones);
    } else {
      const filtered = milestones.filter((milestone) => milestone.category === category);
      setFilteredMilestones(filtered);
    }
  };

  useEffect(() => {
    fetchMilestones(); // Fetch milestone when id changes
  }, [child]);

  useEffect(() => {
    filterByCategory(); // Filter milestones when category changes
  }, [category, milestones]);

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
      <Box
        sx={{
          mt: "16px",
        }}
        className='form-group'
      >
        <form>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <Select
              className='form-control'
              value={category}
              required
              name='category'
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              placeholder='filter by category'
            >
              <option value=''>filter by category</option>
              <option value=''>all categories</option>
              <option value='growth'>growth</option>
              <option value='food'>food</option>
              <option value='health'>health</option>
              <option value='speech'>speech</option>
              <option value='physical'>physical</option>
              <option value='cognitive'>cognitive</option>
              <option value='other'>other</option>
            </Select>
          </Box>
        </form>
      </Box>{" "}
      <h1>Milestones</h1>{" "}
      {filteredMilestones.map((milestone) => (
        <MilestoneBox key={milestone.id} milestone={milestone} />
      ))}
      {filteredMilestones.length === 0 && milestones.length > 0 && (
        <Box>{`There are no milestones in the ${category} category `}</Box>
      )}
      {milestones.length === 0 && <Box>{`There are no milestones for this child`}</Box>}
    </Box>
  );
};

export default MilestonesPage;
