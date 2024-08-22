import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Button = styled("button")({});
const Label = styled("label")({});
const Select = styled("select")({
  width: "100%", // Make sure the select fills the width of its container
  height: "100%", // Ensure it fills the height of its container
  border: "none", // Remove border to fit nicely within the Box
  boxSizing: "border-box", // Include padding and border in the element's total width and height
});

const InviteMember = () => {
  const [allChildren, setAllChildren] = useState([]);
  const [memberData, setMemberData] = useState({ name: "", email: "" });
  const [childrenData, setChildrenData] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchChildren = async () => {
    const url = `http://localhost/api/children/`;
    try {
      const response = await customFetch(url);
      console.log("children", response);
      setAllChildren(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
      setAllChildren([]);
    }
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleChildrenChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "checkbox" && e.target.checked) {
      setChildrenData([...childrenData, value]);
    } else {
      setMemberData({ ...memberData, [name]: value });
    }
  };

  // const handleChildrenChange = (e) => {
  //   const selectedOptions = Array.from(e.target.selectedOptions);
  //   const selectedChildren = selectedOptions.map((option) => option.value);
  //   setChildrenData(selectedChildren);
  // };

  // const handleSelectAll = () => {
  //   const allChildrenIds = allChildren.map((child) => child.id);
  //   setChildrenData(allChildrenIds);
  // };

  // const handleDeselectAll = () => {
  //   setChildrenData([]);
  // };

  // const isAllSelected = () => {
  //   return allChildren.length > 0 && allChildren.every((child) => childrenData.includes(child.id));
  // };

  // const handleSelectAllOptionChange = () => {
  //   if (isAllSelected()) {
  //     handleDeselectAll();
  //   } else {
  //     handleSelectAll();
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { member: memberData, children: childrenData };
    const url = `http://localhost/auth/guardians/${user}/invite/`;
    const options = { body: JSON.stringify(data), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
    } catch (error) {
      console.error("Error creating and sending invite: ", error);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);
  // Calculate the dynamic height of dropdown based on the number of children
  const maxHeight = 400; // Max height of the dropdown
  const optionHeight = 30; // Approximate height of each option
  const dropdownHeight = Math.min(allChildren.length * optionHeight, maxHeight);

  return (
    <Box sx={{ width: "50%" }} className='shadow p-4 mt-4'>
      <h1>Invite a member</h1>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Name</label>
          <input
            type='text'
            className='form-control'
            value={memberData.name}
            name='name'
            onChange={(e) => handleMemberChange(e)}
            placeholder="Enter member's name"
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <label>Email</label>
          <input
            type='email'
            className='form-control'
            value={memberData.email}
            name='email'
            onChange={(e) => handleMemberChange(e)}
            placeholder='Enter member email address'
          />
        </Box>
        <Box
          sx={{
            mt: "16px",
          }}
        >
          <label>Select Children</label>

          {allChildren.map((child) => (
            <Box
              sx={{
                mt: "16px",
              }}
              className='form-group'
              key={child.id}
            >
              <input type='checkbox' value={child.id} name='children' onChange={(e) => handleChange(e)} />
              <Label sx={{ ml: "8px" }}>{child.name}</Label>
            </Box>
          ))}
        </Box>
        <Button
          sx={{
            mt: "16px",
          }}
          type='submit'
          className='btn btn-primary'
        >
          send invite
        </Button>
      </form>
    </Box>
  );
};

export default InviteMember;
