import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { ChildContext } from "../../../context/ChildContext";

const Button = styled("button")({});

const CreateMilestone = () => {
  const [milestoneData, setMilestoneData] = useState({ name: "", description: "", category: "", date: "" });
  const navigate = useNavigate();
  const { child } = useContext(ChildContext);
  const { role } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMilestoneData({ ...milestoneData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/milestones/children/${child.id}/`;
    const options = { body: JSON.stringify(milestoneData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/milestones");
    } catch (error) {
      console.error("Error creating milestone: ", error);
    }
  };

  return (
    <Box sx={{ width: "50%" }} className='shadow p-4 mt-4'>
      <h1>Create a milestone for {child.name} </h1>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Title </label>
          <input
            type='text'
            className='form-control'
            value={milestoneData.name}
            name='name'
            onChange={(e) => handleChange(e)}
            placeholder='Enter milestone title'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Description and details</label>
          <textarea
            className='form-control'
            value={milestoneData.description}
            name='description'
            onChange={(e) => handleChange(e)}
            placeholder='Enter details of milestone'
          />
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
            value={milestoneData.date}
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
          <label>Choose a Category</label>
          <select
            className='form-control'
            value={milestoneData.category}
            name='category'
            onChange={(e) => handleChange(e)}
            placeholder='select a date'
          >
            <option value=''>select a category</option>
            <option value='growth'>growth</option>
            <option value='food'>food</option>
            <option value='health'>health</option>
            <option value='speech'>speech</option>
            <option value='physical'>physical</option>
            <option value='cognitive'>cognitive</option>
            <option value='other'>other</option>
          </select>
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

export default CreateMilestone;
