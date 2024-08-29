import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ArrowBack } from "@mui/icons-material";
import customFetch from "../../fetchWrapper";
import { Input, Button, H1 } from "../typography/Styled";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { event_id, title, id } = useParams();

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

  const handleWishlistClick = (id) => {
    navigate(`/updateWishlist/${event_id}/${title}/${id}`);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handelDeleteWishlist = async (id) => {
    const wistlistUrl = `http://localhost/api/wishlists/${id}/`;
    const options = { method: "DELETE" };
    try {
      const promises = wishlistItems.map((item) => {
        const itemUrl = `http://localhost/api/wishlistItems/${item.id}/`;
        const itemResponse = customFetch(itemUrl, options);
        console.log(itemResponse);
      });
      await Promise.all(promises);
      const response = await customFetch(wistlistUrl, options);
      console.log("response", response);
      navigate(`/events/${event_id}`);
    } catch (error) {
      console.error("Error deleting wishlist and items", error);
    }
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
    <Box
      sx={{
        backgroundColor: "#f8f8f8",
        pt: "128px",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        position: "relative",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "& h1": { marginBottom: "48px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "start", lg: "center" },
            mb: "64px",
            width: "100%",
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          <H1 sx={{ marginBottom: { xs: "16px !important", sm: `8px !important` } }}>{wishlist.name}</H1>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "start", sm: "center" },
              alignItems: { xs: "start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              onClick={() => navigate(`/events/${event_id}`)}
              sx={{
                backgroundColor: "orange",
                border: "none",
                padding: "16px",
                borderRadius: "10px",
                mb: { xs: "16px", sm: "0" },
                "&:hover": {
                  backgroundColor: "#0288d1",
                  color: "white",
                },
              }}
            >
              <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> {title}
            </Button>
            {role === "guardian" && (
              <>
                <Box sx={{ ml: { xs: "0", sm: "24px" } }}>
                  <Button
                    sx={{
                      backgroundColor: "orange",
                      color: "black",
                      border: "none",
                      padding: "16px",
                      borderRadius: "10px",
                      mb: { xs: "16px", sm: "0" },
                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={() => handelDeleteWishlist(wishlist.id)}
                  >
                    Delete Wishlist
                  </Button>
                </Box>
                <Box sx={{ ml: { xs: "0", sm: "24px" } }}>
                  <Button
                    onClick={() => handleWishlistClick(wishlist.id)}
                    sx={{
                      backgroundColor: "orange",
                      color: "black",
                      border: "none",
                      padding: "16px",
                      borderRadius: "10px",
                      "&:hover": {
                        backgroundColor: "yellow",
                      },
                    }}
                  >
                    Update wishlist
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <TableContainer sx={{ width: "100%" }} component={Paper}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "24px", fontWeight: "bold" }}>Item</TableCell>
                <TableCell sx={{ width: "100px", textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell sx={{ width: "100px", textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                  Purchased
                </TableCell>
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
                  <TableCell sx={{ fontSize: "24px" }}>{item.description}</TableCell>
                  <TableCell sx={{ width: "100px", textAlign: "center", fontSize: "24px" }}>
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
      </Box>
    </Box>
  );
};

export default WishlistPage;
