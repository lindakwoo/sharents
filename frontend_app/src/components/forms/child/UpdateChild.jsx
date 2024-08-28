import React, { useState, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { ChildContext } from "../../../context/ChildContext";

import { Box, Modal } from "@mui/material";
import { Button } from "../../typography/Styled";

const UpdateChild = ({ child, open, handleClose }) => {
  const [childData, setChildData] = useState({});
  const { updateChild } = useContext(ChildContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData({ ...childData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/children/${child.id}`;
    const options = { body: JSON.stringify(childData), method: "PUT" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      updateChild(response);
      handleClose();
    } catch (error) {
      console.error("Error updating child: ", error);
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
        <h1>Update Child</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Name</label>
            <input
              type='text'
              className='form-control'
              defaultValue={child.name}
              required
              name='name'
              onChange={(e) => handleChange(e)}
              placeholder="Enter child's name"
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
          >
            <label>Profile Picture</label>
            <input
              type='url'
              className='form-control'
              defaultValue={child.profile_picture}
              required
              name='profile_picture'
              onChange={(e) => handleChange(e)}
              placeholder='https://example.com/'
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Favorite Color</label>
            <input
              type='text'
              className='form-control'
              defaultValue={child.favorite_color}
              name='favorite_color'
              onChange={(e) => handleChange(e)}
              placeholder='Enter a color'
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>Current Obsession</label>
            <input
              type='text'
              className='form-control'
              defaultValue={child.current_thing}
              name='current_thing'
              onChange={(e) => handleChange(e)}
              placeholder='Enter latest thing'
            />
          </Box>
          <Button
            sx={{
              mt: "16px",
            }}
            type='submit'
            className='btn btn-primary'
          >
            Update Child
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateChild;
