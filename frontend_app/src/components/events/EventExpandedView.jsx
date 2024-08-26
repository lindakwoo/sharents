import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import UpdateEvent from "../forms/events/UpdateEvent";
import CreateWishlist from "../forms/events/CreateWishlist";

import moment from "moment";

const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});
const H3 = styled("h3")({});

const EventExpandedView = () => {
  const [event, setEvent] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { role } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [wishListModalOpen, setWishlistModalOpen] = useState(false);
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

  const fetchWishlistItems = async (wishlistId) => {
    const url = `http://localhost/api/wishlists/${wishlistId}/wishlistItems/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlistItems(response.wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlists", error);
      setWishlistItems([]);
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
    const wishListUrl = `http://localhost/api/wishlists/${wishlists[0].id}/`;
    const wishListItemsUrl = `http://localhost/api/wishlists/${wishlists[0].id}/wishlistItems/`;
    const options = { method: "DELETE" };
    try {
      // delete all wishlist items first
      const response = await customFetch(wishListItemsUrl);
      const wishlistItems = response.wishlistItems;
      const promises = wishlistItems.map((item) => {
        const url = `http://localhost/api/wishlistItems/${item.id}`;
        const deleteItemReponse = customFetch(url, options);
        console.log(deleteItemReponse);
        return deleteItemReponse;
      });
      await Promise.all(promises);
      // delete wishlist
      const deleteWishlistResponse = await customFetch(wishListUrl, options);
      console.log(deleteWishlistResponse);
      // delete event
      const deleteEventReponse = await customFetch(url, options);
      console.log(deleteEventReponse);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };
  const dateObj = moment(event.datetime);
  const formattedDate = dateObj.format("MMMM Do YYYY, h:mm a");

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleWishlistOpen = () => setWishlistModalOpen(true);
  const handleWishlistlose = () => setWishlistModalOpen(false);

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
              mr: "16px",
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
          {wishlists.length === 0 && (
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
              onClick={handleWishlistOpen}
            >
              Add a Wishlist
            </Button>
          )}
        </Box>
      )}
      <UpdateEvent fetchEvent={fetchEvent} event={event} open={modalOpen} handleClose={handleClose} id={id} />
      <CreateWishlist
        fetchWishlists={fetchWishlists}
        updatingEvent={true}
        open={wishListModalOpen}
        handleClose={handleWishlistlose}
        eventId={id}
      />
    </Box>
  );
};

export default EventExpandedView;
