import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";

import moment from "moment";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const { id } = useParams();

  const fetchWishlist = async () => {
    const url = `http://localhost/api/wishlists/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlist(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  const fetchWishlistItems = async () => {
    const url = `http://localhost/api/wishlists/${id}/wishlistItems/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlists(response.wishlists);
    } catch (error) {
      console.error("Error fetching wishlists", error);
    }
  };
  useEffect(() => {
    fetchWishlist(); // Fetch event when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchWishlistItems(); // Fetch wishlists when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes
  const dateObj = moment(event.datetime);
  const formattedDate = dateObj.format("MMMM Do YYYY, h:mm:ss a");

  return (
    <Box>
      {event && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>{event.title}</h1>
          <h2>{formattedDate}</h2>
          <h3>{event.description}</h3>
          <h3>location: {event.location}</h3>
          <h4>special notes: {event.notes}</h4>
        </Box>
      )}
      {wishlists.length > 0 && (
        <StyledLink
          to={`/wishlists/${wishlists[0].id}`}
          sx={{ backgroundColor: "yellow", padding: "16px", borderRadius: "10px" }}
        >
          WishList
        </StyledLink>
      )}
    </Box>
  );
};

export default WishlistPage;
