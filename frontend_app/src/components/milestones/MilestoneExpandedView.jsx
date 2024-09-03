import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";
import UpdateMilestone from "../forms/milestones/UpdateMilestone";
import { AuthContext } from "../../context/AuthContext";
import { Button, H1, H2 } from "../typography/Styled";

const MilestoneExpandedView = () => {
  const [milestone, setMilestone] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchMilestone = async () => {
    const url = `http://localhost/api/milestones/${id}/`;
    try {
      const response = await customFetch(url);
      setMilestone(response);
    } catch (error) {
      console.error("Error fetching milestone", error);
    }
  };

  const deleteComment = async (commentId) => {
    const url = `http://localhost/api/comments/${commentId}`;
    const options = { method: "DELETE" };
    try {
      const response = await customFetch(url, options);
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const deleteMilestone = async () => {
    const url = `http://localhost/api/milestones/${id}`;
    const commentsUrl = `http://localhost/api/milestones/${id}/comments/`;
    const options = { method: "DELETE" };
    try {
      const commentsResponse = await customFetch(commentsUrl);
      const comments = commentsResponse.comments;
      if (comments.length > 0) {
        for (let comment of comments) {
          deleteComment(comment.id);
        }
      }
      const response = await customFetch(url, options);
      navigate("/milestones");
    } catch (error) {
      console.error("Error deleting milestone: ", error);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", lg: "row" },
              width: "70%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                mt: { xs: "10px" },
                mb: { xs: "10px" },
              }}
            >
              <Button
                onClick={() => navigate("/milestones")}
                sx={{
                  backgroundColor: "orange",
                  border: "none",
                  padding: "16px",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#0288d1",
                    color: "white",
                  },
                }}
              >
                <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All milestones
              </Button>
              {role === "guardian" && (
                <>
                  <Button
                    sx={{
                      border: "none",
                      backgroundColor: "orange",
                      mx: "16px",
                      padding: "16px",
                      borderRadius: "10px",
                      "& p": { my: 0 },

                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={deleteMilestone}
                  >
                    Delete Milestone
                  </Button>{" "}
                  <Button
                    sx={{
                      border: "none",
                      backgroundColor: "orange",
                      padding: "16px",

                      borderRadius: "10px",
                      "& p": { my: 0 },
                      "&:hover": {
                        backgroundColor: "yellow",
                        color: "#0288d1",
                        fontWeight: "bold",
                      },
                    }}
                    onClick={handleOpen}
                  >
                    Update Milestone
                  </Button>
                </>
              )}
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
          <UpdateMilestone
            fetchMilestone={fetchMilestone}
            milestone={milestone}
            open={modalOpen}
            handleClose={handleClose}
            id={id}
          />
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
