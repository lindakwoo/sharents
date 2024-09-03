import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, Modal } from "@mui/material";
import { Button } from "../../typography/Styled";

const UpdateComment = ({ fetchComments, comment, open, handleClose }) => {
  const [commentData, setCommentData] = useState({});
  const [originalCommentData, setOriginalCommentData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData({ ...commentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/comments/${comment.id}`;
    const options = { body: JSON.stringify(commentData), method: "PUT" };

    try {
      if (JSON.stringify(commentData) !== JSON.stringify(originalCommentData)) {
        const response = await customFetch(url, options);
        fetchComments();
        setOriginalCommentData(commentData);
      }
      handleClose();
    } catch (error) {
      console.error("Error updating comment: ", error);
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
        }}
      >
        <h1>Update Comment</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>text </label>
            <input
              type='text'
              className='form-control'
              name='text'
              defaultValue={comment.text}
              onChange={handleChange}
            />
          </Box>
          <Button
            sx={{
              mt: "16px",
            }}
            type='submit'
            className='btn btn-primary'
          >
            Update Comment
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateComment;
