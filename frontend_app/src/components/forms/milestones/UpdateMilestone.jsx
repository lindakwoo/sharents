import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, Modal } from "@mui/material";
import { Button } from "../../typography/Styled";

const UpdateMilestone = ({ fetchMilestone, milestone, open, handleClose, id }) => {
  const [milestoneData, setMilestoneData] = useState({
    name: milestone.name,
    description: milestone.description,
    category: milestone.category,
  });
  const [originalMilestoneData, setOriginalMilestoneData] = useState({
    name: milestone.name,
    description: milestone.description,
    category: milestone.category,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMilestoneData({ ...milestoneData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/milestones/${id}`;
    const options = { body: JSON.stringify(milestoneData), method: "PUT" };

    try {
      if (JSON.stringify(milestoneData) !== JSON.stringify(originalMilestoneData)) {
        const response = await customFetch(url, options);
        fetchMilestone();
        setOriginalMilestoneData(milestoneData);
      }
      handleClose();
    } catch (error) {
      console.error("Error updating milestone: ", error);
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
        <h1>Update Milestone</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>name </label>
            <input
              type='text'
              className='form-control'
              value={milestoneData.name}
              name='name'
              onChange={(e) => handleChange(e)}
              placeholder='Enter milestone name'
            />
          </Box>
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
              value={milestoneData.description}
              name='description'
              onChange={(e) => handleChange(e)}
              placeholder='Enter milestone description'
            />
          </Box>
          <Box>
            <label>Category</label>
            <select
              type='text'
              className='form-control'
              value={milestoneData.category}
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
            Update Milestone
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateMilestone;
