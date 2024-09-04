import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, Modal } from "@mui/material";
import { Button } from "../../typography/Styled";

const UpdateEvent = ({ fetchEvent, event, open, handleClose, id }) => {
  const [eventData, setEventData] = useState({ ...event });
  const [originalEventData, setOriginalEventData] = useState({ ...event });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/events/${id}`;
    const options = { body: JSON.stringify(eventData), method: "PUT" };

    try {
      if (JSON.stringify(eventData) !== JSON.stringify(originalEventData)) {
        const response = await customFetch(url, options);
        fetchEvent();
        setOriginalEventData(eventData);
      }
      handleClose();
    } catch (error) {
      console.error("Error updating event: ", error);
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
              defaultValue={event.title}
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
              defaultValue={event.description}
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
              defaultValue={event.location}
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>datetime </label>
            <input
              type='datetime-local'
              className='form-control'
              name='datetime'
              defaultValue={event.datetime}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mt: "16px" }} className='form-group'>
            <label>notes </label>
            <input
              type='text'
              className='form-control'
              name='notes'
              defaultValue={event.notes}
              onChange={handleChange}
            />
          </Box>
          <Button
            sx={{
              mt: "16px",
            }}
            type='submit'
            className='btn btn-primary'
          >
            Update Event
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateEvent;
