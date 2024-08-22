import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { ChildContext } from "../../../context/ChildContext";

const Button = styled("button")({});

const CreateEvent = () => {
  const [eventData, setEventData] = useState({ datetime: "", description: "", title: "", location: "", notes: "" });
  const navigate = useNavigate();
  const { child } = useContext(ChildContext);
  const { isGuardian } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/events/children/${child.id}/`;
    const options = { body: JSON.stringify(eventData), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/events");
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  }

  return (
    <Box sx={{ width: "50%" }} className='shadow p-4 mt-4'>
      <h1>Create an event for {child.name} </h1>
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
            value={eventData.title}
            name='title'
            onChange={(e) => handleChange(e)}
            placeholder='Enter event title'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Date and Time</label>
          <input
            type='datetime-local'
            className='form-control'
            value={eventData.datetime}
            name='datetime'
            onChange={(e) => handleChange(e)}
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Location</label>
          <input
            type='text'
            className='form-control'
            value={eventData.location}
            name='location'
            onChange={(e) => handleChange(e)}
            placeholder='Enter event location'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Description</label>
          <textarea
            className='form-control'
            value={eventData.description}
            name='description'
            onChange={(e) => handleChange(e)}
            placeholder='Enter event description'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Notes</label>
          <textarea
            className='form-control'
            value={eventData.notes}
            name='notes'
            onChange={(e) => handleChange(e)}
            placeholder='Enter event notes'
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


// {
//   "datetime": "string",
//     "description": "string",
//       "title": "string",
//         "location": "string",
//           "notes": "string"
// }
export default CreateEvent;
