import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});

const MilestoneExpandedView = () => {
  const [milestone, setMilestone] = useState(null);

  const { id } = useParams();
  const fetchMilestone = async () => {
    const url = `http://localhost/api/milestones/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setMilestone(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching milestone", error);
    }
  };

  useEffect(() => {
    fetchMilestone(); // Fetch milestone when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  return (
    <Box
      sx={{
        mt: "64px",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {milestone && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
            <Box sx={{ justifySelf: "start" }}>
              <StyledLink to='/milestones' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
                <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All milestones
              </StyledLink>
            </Box>
            <Category> {milestone.category}</Category>
          </Box>
          <Box
            sx={{
              width: "70%",
            }}
          >
            <Box>{formatDate(milestone.date, false)}</Box>
            <H1 sx={{ fontSize: "64px", my: "8px" }}>{milestone.name}</H1>
            <H2 sx={{ fontSize: "32px", my: "8px", mb: "32px" }}>{milestone.description}</H2>
            <Box sx={{ mb: "64px" }}>
              <Comments id={id} type='milestone' />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
