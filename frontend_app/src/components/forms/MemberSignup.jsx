import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Link } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";

const Button = styled("button")({});

const MemberSignup = () => {
  const [inviteTokenIsVerified, setInviteTokenIsVerified] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [member, setMember] = useState(null);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { id, token } = useParams();

  const verifyToken = async () => {
    const url = `http://localhost/auth/verify_invite/${id}/${token}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setInviteTokenIsVerified(true);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const acceptInvite = async () => {
    const url = `http://localhost/auth/members/${id}/accept/`;
    const options = { method: "PUT" };
    try {
      const response = await customFetch(url, options);
      console.log("response", response);
      setAccepted(true);
      setMember(response);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const url = `http://localhost/auth/members/${id}/signup`;

    const data = { member: member, password: passwordData.password };
    const options = { body: JSON.stringify(data), method: "PUT" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      console.log("Form submitted successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error signing up member: ", error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [id, token]);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: "128px" }}
      >
        {!inviteTokenIsVerified && (
          <Box>Your invitation token is invalid. Please contact the guardian to ask them to re-invite you.</Box>
        )}
        {inviteTokenIsVerified && !accepted && (
          <Button
            onClick={acceptInvite}
            sx={{ p: "16px", border: "none", backgroundColor: "orange", borderRadius: "10px", m: "64px" }}
          >
            {" "}
            I accept this invitation{" "}
          </Button>
        )}
        {inviteTokenIsVerified && accepted && (
          <Box sx={{ width: "50%" }} className='shadow p-4 mt-4'>
            <h2>Member Signup</h2>
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
                  name='name'
                  value={member.name}
                  onChange={(e) => handleNameChange(e)}
                  placeholder='name'
                  required
                />
              </Box>
              <Box
                sx={{
                  mt: "16px",
                }}
                className='form-group'
              >
                <label>Username</label>
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  value={member.username}
                  onChange={(e) => handleNameChange(e)}
                  placeholder='username'
                  required
                />
              </Box>
              <Box
                sx={{
                  mt: "16px",
                }}
                className='form-group'
              >
                <label>password</label>
                <input
                  className='form-control'
                  type='password'
                  name='password'
                  value={passwordData.password}
                  onChange={(e) => handlePasswordChange(e)}
                  placeholder='Password'
                  required
                />
              </Box>
              <Box
                sx={{
                  my: "16px",
                }}
                className='form-group'
              >
                <label> confirm password</label>
                <input
                  className='form-control'
                  type='password'
                  name='confirmPassword'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder='Confirm Password'
                  required
                />
              </Box>
              <Button type='submit' className='btn btn-primary'>
                Signup
              </Button>
            </form>
          </Box>
        )}
        <Box>{error}</Box>
      </Box>
    </>
  );
};

export default MemberSignup;
