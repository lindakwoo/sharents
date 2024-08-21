import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../../../fetchWrapper';
import { Box, styled } from '@mui/material';

const Button = styled('button')({});

const CreateChild = () => {
  const [childData, setChildData] = useState({ name: '', birthdate: '', profile_picture: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData({ ...childData, [name]: value });
  };
  const guardian_id = "66bf74d0e463457278b2ea36"; // Replace with actual guardian ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/children/guardians/${guardian_id}/`;
    const options = { body: JSON.stringify(childData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.error("Error creating child: ", error);
    }
  };

  return (
    <Box className="row">
      <Box className="offset-3 col-6">
        <Box className="shadow p-4 mt-4">
          <h1>Add Child</h1>
          <form onSubmit={handleSubmit}>
            <Box sx={{
              mt: "16px"
            }} className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={childData.name}
                name="name"
                onChange={e => handleChange(e)}
                placeholder="Enter child's name"
              />
            </Box>
            <Box sx={{
              mt: "16px"
            }} className="form-group">
              <label>Birthdate</label>
              <input
                type="date"
                className="form-control"
                value={childData.birthdate}
                name="birthdate"
                onChange={e => handleChange(e)}
                placeholder="select a date"
              />
            </Box>
            <Box sx={{
              mt: "16px"
            }}>
              <label>Profile Picture</label>
              <input
                type="url"
                className="form-control"
                value={childData.profile_picture}
                name="profile_picture"
                onChange={e => handleChange(e)}
                placeholder="https://example.com/"
              />
            </Box>
            <Button sx={{
              mt: "16px"
            }} type="submit" className="btn btn-primary">Create</Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateChild;
