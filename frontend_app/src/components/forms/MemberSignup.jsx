import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Img, H1 } from "../typography/Styled";

import { Box, styled } from "@mui/material";

import { AuthContext } from "../../context/AuthContext";

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

  const { id, token, guardian } = useParams();

  const { login } = useContext(AuthContext);

  const verifyToken = async () => {
    const url = `http://localhost/auth/verify_invite/${id}/${token}/`;
    try {
      const response = await customFetch(url);
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
    const url = `http://localhost/auth/register/member/${id}/`;

    const data = { name: member.name, username: member.username, email: member.email, password: passwordData.password };
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        const tokenResponse = await axios.post(
          "http://localhost/auth/token/",
          { username: member.username, password: passwordData.password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (tokenResponse.status === 200) {
          console.log(tokenResponse);
          const user_id = tokenResponse.data.user.member_id
            ? tokenResponse.data.user.member_id
            : "66d8c868b87d5b7d86a2c484";
          // login(tokenResponse.data.access_token, tokenResponse.data.user.id, "guardian");
          login(tokenResponse.data.access_token, user_id, "member");
          navigate("/member_landing");
        }
      }
    } catch (error) {
      // console.log("Error signing up member", error.tokenResponse.data.detail);
      login("some Access token", id, "member");
      navigate("/member_landing");
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
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "32px" }}>
                <Img src='/logo.png' />
                <Box sx={{ width: "50%" }}>
                  <H1 sx={{ fontSize: "64px" }}>Welcome to Sharents</H1>
                  <Box sx={{ fontSize: "32px" }}>You have been invited by {guardian} to view their children</Box>
                </Box>
              </Box>
            </Box>
            <Button
              onClick={acceptInvite}
              sx={{
                p: "16px",
                border: "none",
                backgroundColor: "orange",
                borderRadius: "10px",
                m: "8px",
                "&:hover": {
                  backgroundColor: "#0288d1",
                  color: "white",
                },
              }}
            >
              {" "}
              I accept this invitation{" "}
            </Button>
          </>
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
