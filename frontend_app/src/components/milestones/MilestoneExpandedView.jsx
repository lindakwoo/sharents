import React, { useEffect, useState } from "react";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";

const MilestoneExpandedView = ({ id }) => {
  const [milestone, setMilestone] = useState(null);
  const [category, setCategory] = useState("");
  const fetchMilestone = async (id) => {
    const url = `http://localhost/api/milestones/66be8c131ea117fb9f79e2cf`;
    try {
      const response = await customFetch(url);
      console.log(response);
      setMilestone(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching milestone", error);
    }
    // }
  };

  const fetchCategoryName = async (id) => {
    const url = `http://localhost/api/milestones/categories/${milestone.category}/`;
    try {
      const response = await customFetch(url);
      console.log(response);
      setCategory(response.name);
      console.log(response);
    } catch (error) {
      console.error("Error fetching category", error);
    }
  };

  useEffect(() => {
    fetchMilestone(id); // Fetch milestone when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    if (milestone && milestone.category) {
      fetchCategoryName(milestone.category); // Fetch category name when milestone is available
    }
  }, [milestone]);

  return (
    <Box>
      {milestone && (
        <>
          <Box>category: {category}</Box>
          <Box>{milestone.name}</Box>
          <Box>{milestone.description}</Box>
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
