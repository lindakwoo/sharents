import React, { useState, useEffect } from "react";
import customFetch from "../../../fetchWrapper";
import { Box, styled, Modal } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateWishlistItem from "./CreateWishlistItem";

const Button = styled("button")({});

const UpdateWishlist = () => {
  const [wishlistData, setWishlistData] = useState({});
  const [items, setItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleWishlistChange = (e) => {
    const { name, value } = e.target;
    setWishlistData({ ...wishlistData, [name]: value });
  };

  const handleItemChange = (itemId, e) => {
    const { name, value } = e.target;
    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, [name]: value } : item)));
  };

  const handleAddItem = () => {
    setAddedItems([...addedItems, { description: "", url: "", price: 0 }]);
  };

  const handleAddNewItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...addedItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setAddedItems(updatedItems);
  };

  const handleDeleteItem = (id) => {
    // Remove item by id from items
    const deleteUrl = `http://localhost/api/wishlistItems/${id}/`;
    const deleteOptions = {
      method: "DELETE",
    };
    try {
      customFetch(deleteUrl, deleteOptions);
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleRemoveItem = (index) => {
    setAddedItems(addedItems.filter((_, i) => i !== index));
  };

  const fetchWishlist = async () => {
    const url = `http://localhost/api/wishlists/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setWishlistData(response);
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  const fetchWishlistItems = async () => {
    const url = `http://localhost/api/wishlists/${id}/wishlistItems/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setItems(response.wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlists", error);
      setItems([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWishlist();
      await fetchWishlistItems();
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost/api/wishlists/${id}/`;
    const options = {
      body: JSON.stringify({ name: wishlistData.name }),
      method: "PUT",
    };
    try {
      const response = await customFetch(url, options);
      console.log("response", response);
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
    // update the old items in the wishlist.
    for (let item of items) {
      const itemUrl = `http://localhost/api/wishlistItems/${item.id}/`;
      const itemOptions = {
        body: JSON.stringify(item),
        method: "PUT",
      };
      try {
        await customFetch(itemUrl, itemOptions);
      } catch (error) {
        console.error("Error updating wishlist item", error);
      }
    }
    // add new items to wishlist
    for (let item of addedItems) {
      const newItemUrl = `http://localhost/api/wishlists/${id}/wishlistItems/`;
      const itemOptions = {
        body: JSON.stringify(item),
        method: "POST",
      };
      try {
        const response = await customFetch(newItemUrl, itemOptions);
        console.log("response", response);
      } catch (error) {
        console.error("Error creating wishlist item", error);
      }
    }
    navigate(`/wishlists/${id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "50%",
          backgroundColor: "white",
          padding: 4,
        }}
        className='shadow p-4 mt-4'
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
              defaultValue={wishlistData.name}
              onChange={handleWishlistChange}
            />
          </Box>
          {items.length > 0 &&
            items.map((item) => (
              <Box
                key={item.id}
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
                  defaultValue={item.description}
                  onChange={(e) => handleItemChange(item.id, e)}
                  placeholder='Enter description'
                  required
                  className='form-control'
                />
                <label>Item url</label>
                <input
                  type='url'
                  name='url'
                  defaultValue={item.url}
                  onChange={(e) => handleItemChange(item.id, e)}
                  placeholder='Enter URL'
                  className='form-control mt-2'
                />
                <label>Price</label>
                <input
                  type='number'
                  name='price'
                  defaultValue={item.price}
                  step='0.01' // Restrict to two decimal places
                  onChange={(e) => handleItemChange(item.id, e)}
                  placeholder='Enter price'
                  className='form-control mt-2'
                />
                <Button sx={{ mt: "8px" }} onClick={() => handleDeleteItem(item.id)} className='btn btn-danger'>
                  Remove Item
                </Button>
              </Box>
            ))}
          {addedItems.length > 0 &&
            addedItems.map((item, index) => (
              <CreateWishlistItem
                key={index}
                item={item}
                index={index}
                handleItemChange={handleAddNewItemChange}
                handleRemoveItem={handleRemoveItem}
              />
            ))}
          <Button
            sx={{
              mt: "16px",
              backgroundColor: "blue",
              color: "white",
              padding: "8px",
              borderRadius: "10px",
              border: "none",
            }}
            type='button'
            onClick={handleAddItem}
            className='btn btn-secondary'
          >
            Add Item
          </Button>
          <Button
            type='submit'
            style={{
              mt: "16px",
              backgroundColor: "blue",
              color: "white",
              padding: "8px",
              borderRadius: "10px",
              border: "none",
              float: "right",
            }}
          >
            Update Wishlist
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateWishlist;
