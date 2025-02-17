import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import UpdateEvent from "../forms/events/UpdateEvent";
import CreateWishlist from "../forms/events/CreateWishlist";
import { Button, H1, H2, H3 } from "../typography/Styled";
import moment from "moment";

const EventExpandedView = () => {
  const [event, setEvent] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const { role } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [wishListModalOpen, setWishlistModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    const url = `http://localhost/api/events/${id}/`;
    try {
      const response = await customFetch(url);
      setEvent(response);
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  const fetchWishlists = async () => {
    const url = `http://localhost/api/events/${id}/wishlists/`;
    try {
      const response = await customFetch(url);
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
      // delete all wishlist items first
      if (wishlists.length > 0) {
        const wishListUrl = `http://localhost/api/wishlists/${wishlists[0].id}/`;
        const wishListItemsUrl = `http://localhost/api/wishlists/${wishlists[0].id}/wishlistItems/`;
        const response = await customFetch(wishListItemsUrl);
        const wishlistItems = response.wishlistItems;
        const promises = wishlistItems.map((item) => {
          const url = `http://localhost/api/wishlistItems/${item.id}`;
          const deleteItemReponse = customFetch(url, options);
          return deleteItemReponse;
        });
        await Promise.all(promises);
        // delete wishlist
        const deleteWishlistResponse = await customFetch(wishListUrl, options);
      }
      // delete event
      const deleteEventReponse = await customFetch(url, options);
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
    <Box
      sx={{
        mt: "64px",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "70%",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            mt: { xs: "10px" },
            mb: { xs: "10px" },
          }}
        >
          <Button
            onClick={() => navigate("/events")}
            sx={{
              backgroundColor: "orange",
              border: "none",
              padding: "16px",
              borderRadius: "10px",
              mb: { xs: "10px", sm: "0" },
              "&:hover": {
                backgroundColor: "#0288d1",
                color: "white",
              },
            }}
          >
            <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All events
          </Button>
          {role === "guardian" && (
            <>
              <Button
                sx={{
                  border: "none",
                  backgroundColor: "orange",
                  mx: { xs: "0", sm: "16px" },
                  padding: "16px",
                  borderRadius: "10px",
                  mb: { xs: "10px", sm: "0" },
                  "& p": { my: 0 },

                  "&:hover": {
                    backgroundColor: "red",
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
                  backgroundColor: "orange",
                  padding: "16px",

                  borderRadius: "10px",
                  "& p": { my: 0 },

                  "&:hover": {
                    backgroundColor: "yellow",
                    color: "#0288d1",
                    fontWeight: "bold",
                  },
                }}
                onClick={handleOpen}
              >
                Update Event
              </Button>
            </>
          )}
          {wishlists.length === 0 && role === "guardian" && (
            <Button
              sx={{
                border: "none",
                backgroundColor: "orange",
                mx: "16px",
                my: "10px",
                padding: "16px",
                borderRadius: "10px",
                "& p": { my: 0 },
                "&:hover": {
                  backgroundColor: "yellow",
                  color: "#0288d1",
                  fontWeight: "bold",
                },
              }}
              onClick={handleWishlistOpen}
            >
              Add a Wishlist
            </Button>
          )}
        </Box>

        {wishlists.length > 0 && (
          <Box sx={{ justifySelf: "start" }}>
            <Button
              onClick={() => navigate(`/wishlists/${id}/${event.title}/${wishlists[0].id}`)}
              sx={{
                backgroundColor: "orange",
                padding: "16px",
                border: "none",
                borderRadius: "10px",
                mt: { xs: "0", xm: "10px" },
                "&:hover": {
                  backgroundColor: "#0288d1",
                  color: "white",
                },
              }}
            >
              WishList <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
            </Button>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          mt: "64px",
          padding: { xs: "16px", lg: "128px" },
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
              textAlign: "center",
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
