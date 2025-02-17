import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, Modal } from "@mui/material";
import { Button } from "../../typography/Styled";

const UpdateMedia = ({ fetchMedia, media, open, handleClose, id }) => {
  const [mediaData, setMediaData] = useState({ description: media.description, category: media.category });
  const [originalMediaData, setOriginalMediaData] = useState({ description: media.description, category: media.category });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMediaData({ ...mediaData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/media/${id}`;
    const options = { body: JSON.stringify(mediaData), method: "PUT" };

    try {
      if (JSON.stringify(mediaData) !== JSON.stringify(originalMediaData)) {
        const response = await customFetch(url, options);
        fetchMedia();
        setOriginalMediaData(mediaData);
      }
      handleClose();
    } catch (error) {
      console.error("Error updating media: ", error);
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
        <h1>Update Media</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>description </label>
            <input
              type='text'
              className='form-control'
              name='description'
              value={mediaData.description}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <label>Category</label>
            <select
              type='text'
              className='form-control'
              value={mediaData.category}
              name='category'
              onChange={(e) => handleChange(e)}
            >
              <option value=''>Select Category</option>
              {["growth", "food", "health", "speech", "physical", "cognitive", "other"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Box>
          <Button
            sx={{
              mt: "16px",
            }}
            type='submit'
            className='btn btn-primary'
          >
            Update Media
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateMedia;
