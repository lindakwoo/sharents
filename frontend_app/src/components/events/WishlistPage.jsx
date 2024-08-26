import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import customFetch from "../../fetchWrapper";
import { Box, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import UpdateWishlist from "../forms/events/UpdateWishlist";

const Input = styled("input")({});
const Button = styled("button")({});

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const { role } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
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
      setWishlistItems([]);
    }
  };
  useEffect(() => {
    fetchWishlist(); // Fetch wishlist when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchWishlistItems(); // Fetch wishlists when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  const handleRowClick = (url) => {
    // Navigate to the event details page
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("there is no vendor listed for this item");
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
      <TableContainer sx={{ width: "60%" }} component={Paper}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell sx={{ width: "100px", textAlign: "center" }}>Price</TableCell>
              <TableCell sx={{ width: "100px", textAlign: "center" }}>Purchased</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wishlistItems.map((item, index) => (
              <TableRow
                key={item.id}
                onClick={() => handleRowClick(item.url)}
                sx={{
                  "&:hover": {
                    backgroundColor: "aqua",
                  },
                  cursor: "pointer",
                }}
              >
                <TableCell>{item.description}</TableCell>
                <TableCell sx={{ width: "100px", textAlign: "center" }}>
                  {item.price ? formatPrice(item.price) : ``}
                </TableCell>
                <TableCell sx={{ width: "100px", textAlign: "center" }}>
                  <Input
                    sx={{ width: "20px", height: "20px" }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(index)}
                    type='checkbox'
                    checked={item.is_purchased}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {role === "guardian" && (
        <Box>
          <Box sx={{ position: "fixed", bottom: "16px", right: "16px" }}>

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
              Update Wishlist
            </Button>
            <UpdateWishlist fetchWishlist={fetchWishlist} open={modalOpen} wishlist={wishlist} wishlistItems={wishlistItems} handleClose={handleClose} id={id} />
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default WishlistPage;
