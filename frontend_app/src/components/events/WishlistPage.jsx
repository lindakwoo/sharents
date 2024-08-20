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
    const url = `http://localhost/api/wishlists/${id}`;
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
    const url = `http://localhost/api/wishlists/${id}/wishlistItems`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlistItems(response.wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlists", error);
    }
  };
  useEffect(() => {
    fetchWishlist(); // Fetch wishlist when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchWishlistItems(); // Fetch wishlists when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  return (
    <Box>


    </Box>
  );
};

export default WishlistPage;
