import React, { useState, useEffect, useContext } from "react";
import customFetch from "../../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { ChildContext } from "../../../context/ChildContext";
import CreateWishlistItem from "./CreateWishlistItem";

const Button = styled("button")({});

const CreateWishlist = ({ event }) => {
  const [name, setName] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const { child } = useContext(ChildContext);
  const { role } = useContext(AuthContext);

  const handleWishlistNameChange = (e) => {
    const { name, value } = e.target;
    setName({ ...name, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...wishlistItems];
    newItems[index] = { ...newItems[index], [name]: value };
    setWishlistItems(newItems);
  };

  const handleAddItem = () => {
    console.log("Inside");
    setWishlistItems([...wishlistItems, { description: "", url: "", price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setWishlistItems(wishlistItems.filter((_, i) => i !== index));
  };

  const handleWishlistSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Create the Wishlist
    const wishlistUrl = `http://localhost/api/events/${event.id}/wishlists/`;
    const wishlistOptions = {
      body: JSON.stringify({ name: name }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const wishlistResponse = await customFetch(wishlistUrl, wishlistOptions);
      const wishlist = wishlistResponse; // Assuming the response returns the wishlist ID

      // Step 2: Create each Wishlist Item
      for (let item of wishlistItems) {
        const itemUrl = `http://localhost/api/wishlists/${wishlist.id}/wishlistItems/`;
        const itemOptions = {
          body: JSON.stringify(item),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
        await customFetch(itemUrl, itemOptions);
      }

      console.log("Wishlist and items created successfully");
      //   navigate("/milesteventones");
    } catch (error) {
      console.error("Error creating wishlist or items: ", error);
    }
  };

  return (
    <Box className='shadow p-4 mt-4'>
      <h1>Create a milestone for {child.name} </h1>
      <form onSubmit={handleWishlistSubmit}>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Wishlist Name </label>
          <input
            type='text'
            className='form-control'
            value={name}
            name='name'
            onChange={(e) => handleWishlistNameChange(e)}
            placeholder='Enter wishlist name'
          />
        </Box>
        {wishlistItems.length > 0 &&
          wishlistItems.map((item, index) => (
            <CreateWishlistItem
              key={index}
              item={item}
              index={index}
              handleItemChange={handleItemChange}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
        <Button sx={{ mt: "16px" }} type='button' onClick={handleAddItem} className='btn btn-secondary'>
          Add Wishlist Item
        </Button>
        <Button sx={{ mt: "16px", ml: "8px" }} type='submit' className='btn btn-primary'>
          Create Wishlist
        </Button>
      </form>
    </Box>
  );
};

export default CreateWishlist;
