import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";


const Button = styled("button")({});

const UpdateEvent = ({ fetchEvent, event, open, handleClose, id }) => {
  console.log("event on modal: ", event);
  const [eventData, setEventData] = useState({ datetime: event.datetime, description: event.description, title: event.title, location: event.location, notes: event.notes });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/events/${id}`;
    const options = { body: JSON.stringify(eventData), method: "PUT" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      fetchEvent();
      handleClose();
    } catch (error) {
      console.error("Error updating event: ", error);
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
        <h1>Update Event</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>title </label>
            <input
              type='text'
              className='form-control'
              name='title'
              value={eventData.title}
              onChange={handleChange}
            />
          </Box>
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
              value={eventData.description}
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>location </label>
            <input
              type='text'
              className='form-control'
              name='location'
              value={eventData.location}
              onChange={handleChange}
            />
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// {
//   "datetime": "string",
//     "description": "string",
//       "title": "string",
//         "location": "string",
//           "notes": "string"
// }

export default UpdateEvent;
