import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import MilestoneBox from "./MilestoneBox";
import { StyledSelect } from "../typography/Styled";

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const { child } = useContext(ChildContext);
  const { isAuth } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
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
    if (child) {
      fetchMilestones(); // Fetch milestone when id changes
    }
  }, [child]);

  useEffect(() => {
    filterByCategory(); // Filter milestones when category changes
  }, [category, milestones]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  return child ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
        padding: "64px",
        backgroundColor: "#f8f8f8",
        minHeight: "100vh", // Ensure the Box covers at least the viewport height
        height: "100%", // Ensure the Box takes full height
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
            <StyledSelect
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
            </StyledSelect>
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
  ) : null;
};

export default MilestonesPage;
