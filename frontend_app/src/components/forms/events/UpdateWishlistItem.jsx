import React from "react";
import { Box, styled } from "@mui/material";

const Button = styled("button")({});

const UpdateWishlistItem = ({ id, index, item, description, price, url, handleItemChange, handleAddItem, handleWishlistChange, handleRemoveItem, handleDeleteItem }) => {


  return (
    <Box
      sx={{
        mt: "16px",
      }}
      className='form-group'
    >
      <Box sx={{ fontWeight: "bold" }}>Wishlist Item</Box>
      <label>Description</label>
      <input
        type='text'
        name='description'
        defaultValue={description}
        onChange={(e) => handleItemChange(id, e)}
        placeholder='Enter description'
        required
        className='form-control'
      />
      <label>Item url</label>
      <input
        type='url'
        name='url'
        defaultValue={url}
        onChange={(e) => handleItemChange(id, e)}
        placeholder='Enter URL'
        className='form-control mt-2'
      />
      <label>Price</label>
      <input
        type='number'
        name='price'
        defaultValue={price}
        step='0.01' // Restrict to two decimal places
        onChange={(e) => handleItemChange(id, e)}
        placeholder='Enter price'
        className='form-control mt-2' />
      <Button sx={{ mt: "8px" }} onClick={() => handleRemoveItem(id)} className='btn btn-danger'>
        Remove Item
      </Button>

    </Box>
  );
};

export default UpdateWishlistItem;
