import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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

  const handleCheckboxChange = async (index) => {
    const item = wishlistItems[index];
    const updatedItem = { ...item, is_purchased: !item.is_purchased };
    const options = { body: JSON.stringify(updatedItem), method: "PUT" };
    const url = `http://localhost/api/wishlistItems/${item.id}/`;
    try {
      const response = await customFetch(url, options);
      console.log("response", response);
      setWishlistItems((prevItems) => {
        const newItems = [...prevItems];
        newItems[index] = response;
        return newItems;
      });
    } catch (error) {
      console.error("Error updating wishlist item", error);
    }
  };
  return (
    <Box>
      <h1>{wishlist.name}</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Purchased</TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {wishlistItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell><StyledLink sx={{
                  "&:hover": {
                    backgroundColor: "orange",
                    color: "white",
                  }
                }} to={item.url} target="_">
                  {item.description}
                </StyledLink>
                </TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell><input onChange={() => handleCheckboxChange(index)} type="checkbox" checked={item.is_purchased} /></TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WishlistPage;
