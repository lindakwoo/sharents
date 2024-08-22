import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { ChildContext } from "../../../context/ChildContext";

const Button = styled("button")({});

const CreateMedia = () => {
  const [mediaData, setMediaData] = useState({ description: "", category: "", date: "", type: "", url: "" });
  const navigate = useNavigate();
  const { child } = useContext(ChildContext);
  const { isGuardian } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMediaData({ ...mediaData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/media/children/${child.id}/`;
    const options = { body: JSON.stringify(mediaData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/media");
    } catch (error) {
      console.error("Error creating media: ", error);
    }
  }

  return (
    <Box sx={{ width: "50%" }} className='shadow p-4 mt-4'>
      <h1>Create a media for {child.name} </h1>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Description </label>
          <input
            type='text'
            className='form-control'
            value={mediaData.description}
            name='description'
            onChange={(e) => handleChange(e)}
            placeholder='Enter media description'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Category</label>
          <select
            type='text'
            className='form-control'
            value={mediaData.category}
            name='category'
            onChange={(e) => handleChange(e)}
            placeholder='Enter media category'
          >
            <option value=''>Select Category</option>
            {["growth", "food", "health", "speech", "physical", "cognitive", "other"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Date</label>
          <input
            type='date'
            className='form-control'
            value={mediaData.date}
            name='date'
            onChange={(e) => handleChange(e)}
            placeholder='select a date'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Type</label>
          <select
            type='text'
            className='form-control'
            value={mediaData.type}
            name='type'
            onChange={(e) => handleChange(e)}
            placeholder='Enter media type'
          >
            <option value=''>Select Type</option>
            {["video", "photo"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>URL</label>
          <input
            type='text'
            className='form-control'
            value={mediaData.url}
            name='url'
            onChange={(e) => handleChange(e)}
            placeholder='Enter url'
          />
        </Box>
        <Button
          sx={{
            mt: "16px",
          }}
          type='submit'
          className='btn btn-primary'
        >
          Create
        </Button>
      </form>
    </Box>
  )
};
// {
//   "description": "string",
//     "category": "growth",
//       "date": "string",
//         "type": "string",
//           "url": "string"
// }
export default CreateMedia;
