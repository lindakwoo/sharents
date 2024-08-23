import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Button = styled("button")({});

const UpdateMedia = ({ fetchMedia, media, open, handleClose, id }) => {
  const [mediaData, setMediaData] = useState({ description: media.description, category: media.category, date: media.date, type: media.type, url: media.url });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMediaData({ ...mediaData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/media/${id}`;
    const options = { body: JSON.stringify(mediaData), method: "PUT" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      fetchMedia();
      handleClose();

    } catch (error) {
      console.error("Error updating media: ", error);
    }
  }

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
          <Box>
            <label>Type</label>
            <select
              type='text'
              className='form-control'
              value={mediaData.type}
              name='type'
              onChange={(e) => handleChange(e)}
            >
              <option value=''>Select type</option>
              {["photo", "video"].map((type) => (
                <option key={type} value={type}>
                  {type}
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
  )
};
{/* {
  "description": "string",
    "category": "growth",
      "date": "string",
        "type": "string",
          "url": "string"
} */}
export default UpdateMedia;
