import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";

const Button = styled("button")({});

const MilestoneExpandedView = () => {
  const [milestone, setMilestone] = useState(null);
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    const url = `http://localhost/api/milestones/${id}/comments/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setComments(response.comments);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  useEffect(() => {
    fetchMilestone(); // Fetch milestone when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchComments(); // Fetch milestone when id changes
  }, [id]);

  return (
    <Box>
      {milestone && (
        <>
          <Box
            sx={{
              fontSize: "48px",
              padding: "8px",
              backgroundColor: "yellow",
              width: "150px",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            {milestone.category}
          </Box>
          <Box>{formatDate(milestone.date, false)}</Box>
          <h1>{milestone.name}</h1>
          <Box>{milestone.description}</Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
              {" "}
              <h2>Comments:</h2>{" "}
              <Button
                sx={{
                  border: "none",
                  backgroundColor: "yellow",
                  padding: "8px",
                  borderRadius: "10px",
                  "& p": { my: 0 },
                  maxHeight: "50px",
                  "&:hover": {
                    backgroundColor: "orange",
                    color: "white",
                  },
                }}
              >
                <p>Add a comment</p>
              </Button>
            </Box>
            {/* <Box sx={{ width: "80%" }}> */}
            {comments.length > 0 &&
              comments.map((comment) => {
                return (
                  <Box
                    sx={{
                      boxSizing: "border-box",
                      width: "80%",
                      border: "black 1px solid",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    {comment.text}
                  </Box>
                );
              })}
          </Box>
          {/* </Box> */}
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
