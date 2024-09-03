import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { ChildContext } from "../../../context/ChildContext";

const Button = styled("button")({});

const CreateChild = () => {
  const [childData, setChildData] = useState({
    name: "",
    birthdate: "",
    profile_picture: "",
    favorite_color: "",
    current_thing: "",
  });
  const { user, role } = useContext(AuthContext);
  const { selectChild } = useContext(ChildContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData({ ...childData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/children/guardians/${user}/`;
    const options = { body: JSON.stringify(childData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      selectChild(response.id);
      navigate("/home");
    } catch (error) {
      console.error("Error creating child: ", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }} className='shadow p-4 mt-4'>
      <h1>Add Child</h1>
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
            value={childData.name}
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
          className='form-group'
        >
          <label>Birthdate</label>
          <input
            type='date'
            className='form-control'
            value={childData.birthdate}
            required
            name='birthdate'
            onChange={(e) => handleChange(e)}
            placeholder='select a date'
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
            value={childData.profile_picture}
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
            value={childData.favorite_color}
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
            value={childData.current_thing}
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
          Create
        </Button>
      </form>
    </Box>
  );
};

export default CreateChild;
