import React from "react";
import { Box, styled } from "@mui/material";

const Button = styled("button")({});

const CreateWishlistItem = ({ item, index, handleItemChange, handleRemoveItem }) => {
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Allow numeric values and up to two decimal places
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    const isValid = /^\d*\.?\d{0,2}$/.test(cleanedValue);
    if (isValid) {
      handleItemChange(index, { target: { name, value: cleanedValue } });
    }
  };
  return (
    <Box
      sx={{
        mt: "16px",
      }}
      className='form-group'
    >
      <label>Wishlist Item {index + 1}</label>
      <input
        type='text'
        name='description'
        value={item.description}
        onChange={(e) => handleItemChange(index, e)}
        placeholder='Enter description'
        className='form-control'
      />
      <input
        type='url'
        name='url'
        value={item.url}
        onChange={(e) => handleItemChange(index, e)}
        placeholder='Enter URL'
        className='form-control mt-2'
      />
      <input
        type='number'
        name='price'
        value={item.price}
        step='0.01' // Restrict to two decimal places
        min='0'
        onChange={handlePriceChange}
        placeholder='Enter price'
        className='form-control mt-2'
      />
      <Button sx={{ mt: "8px" }} onClick={() => handleRemoveItem(index)} className='btn btn-danger'>
        Remove Item
      </Button>
    </Box>
  );
};

export default CreateWishlistItem;
