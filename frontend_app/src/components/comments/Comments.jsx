import React, { useEffect, useState, useContext } from "react";
import customFetch from "../../fetchWrapper";
import { Box } from "@mui/material";
import CreateComment from "../forms/comments/CreateComment";
import UpdateComment from "../forms/comments/UpdateComment";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AuthContext } from "../../context/AuthContext";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "../typography/Styled";

const Comments = ({ id, type }) => {
  const [comments, setComments] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const urlType = type === "milestone" ? "milestones" : type;
  const { user } = useContext(AuthContext);

  const fetchComments = async () => {
    const url = `http://localhost/api/${urlType}/${id}/comments/`;
    try {
      const response = await customFetch(url);
      setComments(response.comments);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleOpenUpdateModal = (comment) => {
    setSelectedComment(comment);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedComment("");
    setUpdateModalOpen(false);
  };

  const deleteComment = async (commentId) => {
    const url = `http://localhost/api/comments/${commentId}`;
    const options = { method: "DELETE" };
    try {
      const response = await customFetch(url, options);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

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
          onClick={handleOpenCreateModal}
        >
          Add a comment
        </Button>
      </Box>
      <Box>
        {comments.length > 0 &&
          comments.map((comment) => {
            const isCommentOwner = comment.member === user || comment.guardian === user;
            return (
              <Box key={comment.id}>
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
                  {isCommentOwner && (
                    <>
                      <UpdateIcon
                        sx={{
                          float: "right",
                          cursor: "pointer",
                          color: "orange",
                          "&:hover": {
                            backgroundColor: "orange",
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          handleOpenUpdateModal(comment);
                        }}
                      />
                      <Tooltip placement='top' title='delete comment'>
                        <DeleteForeverIcon
                          sx={{
                            float: "right",
                            cursor: "pointer",
                            color: "red",
                            "&:hover": {
                              backgroundColor: "red",
                              color: "white",
                            },
                          }}
                          onClick={() => {
                            deleteComment(comment.id);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>
      <CreateComment
        fetchComments={fetchComments}
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        type={type}
        id={id}
      />
      <UpdateComment
        fetchComments={fetchComments}
        open={updateModalOpen}
        handleClose={handleCloseUpdateModal}
        type={type}
        comment={selectedComment}
      />
    </>
  );
};

export default Comments;
