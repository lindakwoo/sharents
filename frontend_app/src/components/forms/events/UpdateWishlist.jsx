import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";


const Button = styled("button")({});

const UpdateWishlist = ({ fetchWishlist, wishlist, wishlistItems, open, handleClose, id }) => {
  const [wishlistData, setWishlistData] = useState({});
  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWishlistData({ ...wishlistData, [name]: value });
  }
  //  change the name of the wishlist
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/wishlists/${id}`;
    const options = { body: JSON.stringify(wishlistData), method: "PUT" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      fetchWishlist();
      handleClose();
    } catch (error) {
      console.error("Error updating wishlist: ", error);
    }
  }
  // change the items in the wishlist
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  }
  // add an item to the wishlist
  const handleAddItem = () => {
    setItems([...items, { description: "", url: "", price: 0 }]);
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  }

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/wishlists/${id}/wishlistItems/`;
    const options = { body: JSON.stringify(items), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      fetchWishlists();
      handleClose();
    } catch (error) {
      console.error("Error updating wishlist items: ", error);
    }
  }


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
        <h1>Update Wishlist</h1>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: "16px",
            }}
            className='form-group'
          >
            <label>name </label>
            <input
              type='text'
              className='form-control'
              name='name'
              defaultValue={wishlist.name}
              onChange={handleChange}
            />
          </Box>
          <Button type='submit' style={{ backgroundColor: "blue", color: "white", padding: "8px", borderRadius: "10px", border: "none" }}>Update Wishlist</Button>
        </form>
      </Box>
    </Modal>
  );
}

export default UpdateWishlist;