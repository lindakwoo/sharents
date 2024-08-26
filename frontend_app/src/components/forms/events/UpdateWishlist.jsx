import React, { useState } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";
import UpdateWishlistItem from "./UpdateWishlistItem";


const Button = styled("button")({});

const UpdateWishlist = () => {
  const [wishlistData, setWishlistData] = useState({});
  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWishlistData({ ...wishlistData, [name]: value });
  }

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  }

  const handleDeleteItem = (index) => {
    console.log("delete item", index);
  }


  //  change the name of the wishlist
  const handleSubmit = async (e) => {
    // e.preventDefault();
    // const url = `http://localhost/api/wishlists/${id}`;
    // const options = { body: JSON.stringify(wishlistData), method: "PUT" };

    // try {
    //   const response = await customFetch(url, options);
    //   for (let item of items) {
    //     const itemUrl = `http://localhost/api/wishlists/${id}/wishlistItems/${item.id}`;

    //     const itemOptions = {
    //       body: JSON.stringify(item),
    //       method: "PUT",
    //     };
    //     const itemResponse = await customFetch(itemUrl, itemOptions);
    //   }
    //   console.log(response);
    //   fetchWishlist();
    //   handleClose();
    // } catch (error) {
    //   console.error("Error updating wishlist: ", error);
    // }
  }



  return (
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
            // defaultValue={wishlist.name}
            onChange={handleChange}
          />
        </Box>
        {/* {wishlistItems.length > 0 &&
          wishlistItems.map((item) => (
            <UpdateWishlistItem
              id={item.id}
              description={item.description}
              price={item.price}
              url={item.url}
              handleItemChange={handleItemChange}
              handleRemoveItem={handleDeleteItem}
            />
          ))} */}

        <Button type='submit' style={{ backgroundColor: "blue", color: "white", padding: "8px", borderRadius: "10px", border: "none" }}>Update Wishlist</Button>
      </form>
    </Box>
  );
}

export default UpdateWishlist;