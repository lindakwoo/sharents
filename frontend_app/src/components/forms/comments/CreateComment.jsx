import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { Button } from "../../typography/Styled";

const CreateComment = ({ fetchComments, open, handleClose, type, id }) => {
  const [commentData, setCommentData] = useState({ text: "" });
  const { user, role } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData({ ...commentData, [name]: value });
  };

  const urlType = type === "milestone" ? "milestones" : type;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const getUserUrl =
      // TODO: make sure these endpoints work cuz they don't right now...
      role === "guardian" ? `http://localhost/api/guardians/${user}/` : `http://localhost/api/members/${user}/`;
    try {
      const userResponse = await customFetch(getUserUrl);
      commentData.creator_name = userResponse.name;
    } catch (error) {
      console.error("Error getting user: ", error);
      // TODO: REMOVE THIS LINE
      commentData.creator_name = "Jane Doe";
    }
    if (role === "guardian") {
      commentData.guardian = user;
    } else {
      commentData.member = user;
    }

    const url = `http://localhost/api/${urlType}/${id}/comments/`;
    const options = { body: JSON.stringify(commentData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      fetchComments();
      handleClose();
    } catch (error) {
      console.error("Error creating comment: ", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: "50%",
          backgroundColor: "white",
          padding: 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          borderRadius: 2,
        }}
        className='shadow p-4 mt-4'
      >
        <h1>Create a comment for this {type} </h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Comment on milestone</label>
            <textarea
              className='form-control'
              value={commentData.description}
              name='text'
              onChange={(e) => handleChange(e)}
              placeholder='Enter your comment here'
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleClose}
              sx={{
                mt: "16px",
                backgroundColor: "red",
                color: "white",
              }}
              className='btn btn-tertiary'
            >
              Cancel
            </Button>
            <Button
              sx={{
                mt: "16px",
              }}
              type='submit'
              className='btn btn-primary'
            >
              Create
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateComment;
