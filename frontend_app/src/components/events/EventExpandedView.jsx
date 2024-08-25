import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import UpdateEvent from "../forms/events/UpdateEvent";

import moment from "moment";

const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});
const H3 = styled("h3")({});

const EventExpandedView = () => {
  const [event, setEvent] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const { role } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    const url = `http://localhost/api/events/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);

      setEvent(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  const fetchWishlists = async () => {
    const url = `http://localhost/api/events/${id}/wishlists/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlists(response.wishlists);
    } catch (error) {
      console.error("Error fetching wishlists", error);
    }
  };
  useEffect(() => {
    fetchEvent(); // Fetch event when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchWishlists(); // Fetch wishlists when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  const deleteEvent = async () => {
    const url = `http://localhost/api/events/${id}`;
    const options = { method: "DELETE" };
    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };
  const dateObj = moment(event.datetime);
  const formattedDate = dateObj.format("MMMM Do YYYY, h:mm a");

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: "64px" }}>
      <Box sx={{ display: "flex", width: "80vw", justifyContent: "space-between", mb: "64px" }}>
        <Box sx={{ justifySelf: "start" }}>
          <StyledLink
            to='/events'
            sx={{
              backgroundColor: "orange",
              padding: "16px",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#0288d1",
                color: "white",
              },
            }}
          >
            <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All events
          </StyledLink>
        </Box>

        {wishlists.length > 0 && (
          <Box sx={{ justifySelf: "start" }}>
            <StyledLink
              to={`/wishlists/${wishlists[0].id}`}
              sx={{
                backgroundColor: "yellow",
                padding: "16px",
                borderRadius: "10px",
              }}
            >
              WishList <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
            </StyledLink>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          mt: "64px",
          padding: "128px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {event && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mb: "64px",
            }}
          >
            <H1 sx={{ fontSize: "64px", my: "8px" }}>{event.title}</H1>
            <H2 sx={{ fontSize: "48px", my: "8px" }}>{formattedDate}</H2>
            <H3 sx={{ fontSize: "32px", my: "8px" }}>{event.description}</H3>
            <H3 sx={{ fontSize: "24px", my: "8px" }}>location: {event.location}</H3>
            <H3 sx={{ fontSize: "24px", my: "8px" }}>special notes: {event.notes}</H3>
          </Box>
        )}
      </Box>

      {role === "guardian" && (
        <Box sx={{ position: "fixed", bottom: "16px", right: "16px" }}>
          <Button
            sx={{
              border: "none",
              backgroundColor: "red",
              mr: "16px",
              color: "white",
              padding: "8px",
              borderRadius: "10px",
              "& p": { my: 0 },
              maxHeight: "50px",
              "&:hover": {
                backgroundColor: "#0288d1",
                color: "white",
              },
            }}
            onClick={deleteEvent}
          >
            Delete Event
          </Button>{" "}
          <Button
            sx={{
              border: "none",
              backgroundColor: "yellow",
              padding: "8px",
              borderRadius: "10px",
              "& p": { my: 0 },
              maxHeight: "50px",
              "&:hover": {
                backgroundColor: "#0288d1",
                color: "white",
              },
            }}
            onClick={handleOpen}
          >
            Update Event
          </Button>
        </Box>
      )}
      <UpdateEvent fetchEvent={fetchEvent} event={event} open={modalOpen} handleClose={handleClose} id={id} />
    </Box>
  );
};

export default EventExpandedView;
