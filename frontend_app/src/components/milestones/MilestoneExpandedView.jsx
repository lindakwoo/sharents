import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import CreateComment from "../forms/comments/CreateComment";

const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});
const H3 = styled("h3")({});

const MilestoneExpandedView = () => {
  const [milestone, setMilestone] = useState(null);
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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
    console.log("inside!");
    const url = `http://localhost/api/milestones/${id}/comments/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setComments(response.comments);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    fetchMilestone(); // Fetch milestone when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchComments(); // Fetch milestone when id changes
  }, [id]);

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
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: "16px" }}>
                {" "}
                <H3>Comments:</H3>{" "}
                <Button
                  sx={{
                    border: "none",
                    backgroundColor: "orange",
                    padding: "8px",
                    borderRadius: "10px",
                    "& p": { my: 0 },
                    maxHeight: "50px",
                    "&:hover": {
                      backgroundColor: "#0288d1",
                      color: "white",
                    },
                  }}
                  onClick={handleOpen}
                >
                  Add a comment
                </Button>
              </Box>

              {comments.length > 0 &&
                comments.map((comment) => {
                  return (
                    <>
                      {comment.creator_name && <Box>{comment.creator_name}:</Box>}
                      <Box
                        sx={{
                          boxSizing: "border-box",

                          border: "black 1px solid",
                          borderRadius: "10px",
                          padding: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        {comment.text}
                      </Box>
                    </>
                  );
                })}
            </Box>
          </Box>
          <CreateComment
            fetchComments={fetchComments}
            open={modalOpen}
            handleClose={handleClose}
            type='milestone'
            id={id}
          />
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
