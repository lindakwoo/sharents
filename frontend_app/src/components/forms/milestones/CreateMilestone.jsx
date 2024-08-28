import React, { useState, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ChildContext } from "../../../context/ChildContext";
import { Button } from "../../typography/Styled";

const CreateMilestone = () => {
  const [milestoneData, setMilestoneData] = useState({ name: "", description: "", category: "", date: "" });
  const navigate = useNavigate();
  const { child } = useContext(ChildContext);

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
    <Box className='shadow p-4 mt-4'>
      <h1>Create a milestone for {child.name} </h1>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Name </label>
          <input
            type='text'
            className='form-control'
            value={milestoneData.name}
            required
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
            required
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
            required
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
            required
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
