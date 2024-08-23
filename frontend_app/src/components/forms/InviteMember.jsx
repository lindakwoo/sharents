import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Button = styled("button")({});
const Label = styled("label")({});

const InviteMember = () => {
  const [allChildren, setAllChildren] = useState([]);
  const [memberData, setMemberData] = useState({ name: "", email: "" });
  const [childrenData, setChildrenData] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "checkbox" && e.target.checked) {
      setChildrenData([...childrenData, value]);
    } else {
      setMemberData({ ...memberData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { member: memberData, children: childrenData };
    const url = `http://localhost/auth/guardians/${user}/invite/`;
    const options = { body: JSON.stringify(data), method: "POST" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/home");
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
    <Box className='shadow p-4 mt-4'>
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
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
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
