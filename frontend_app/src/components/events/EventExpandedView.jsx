import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

import moment from "moment";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});
const H3 = styled("h3")({});

const EventExpandedView = () => {
  const [event, setEvent] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const { id } = useParams();

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
  const dateObj = moment(event.datetime);
  const formattedDate = dateObj.format("MMMM Do YYYY, h:mm:ss a");

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
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
      <Box sx={{ display: "flex", width: "80vw", justifyContent: "space-between", mb: "64px" }}>
        <Box sx={{ justifySelf: "start" }}>
          <StyledLink to='/events' sx={{ backgroundColor: "yellow", padding: "16px", borderRadius: "10px" }}>
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
    </Box>
  );
};

export default EventExpandedView;
