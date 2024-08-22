import React, { useEffect, useState } from "react";
import customFetch from "../../fetchWrapper";
import { Link } from "react-router-dom";
import { Box, styled } from "@mui/material";
import CreateComment from "../forms/comments/CreateComment";

const Button = styled("button")({});

const Comments = ({ id, type }) => {
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const urlType = type === "milestone" ? "milestones" : type;

  const fetchComments = async () => {
    const url = `http://localhost/api/${urlType}/${id}/comments/`;
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
    fetchComments(); // Fetch media when id changes
  }, [id]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: "16px" }}>
        {" "}
        <h2>Comments:</h2>{" "}
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
      <Box>
        {comments.length > 0 &&
          comments.map((comment) => {
            return (
              <>
                {comment.creator_name && (
                  <Box sx={{ color: "orange", fontWeight: "bold", fontStyle: "italic" }}>{comment.creator_name}:</Box>
                )}
                <Box
                  sx={{
                    boxSizing: "border-box",
                    width: "100%",
                    border: "lightgrey 1px solid",
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
      <CreateComment fetchComments={fetchComments} open={modalOpen} handleClose={handleClose} type={type} id={id} />
    </>
  );
};

export default Comments;
