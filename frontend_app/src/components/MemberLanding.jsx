import React, { useState, useContext, useEffect } from "react";
import customFetch from "../fetchWrapper";
import { Link, useNavigate } from "react-router-dom";
import { styled, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";

const H1 = styled("h1")({});

const Img = styled("img")({});

const MemberLanding = () => {
  const [childrenList, setChildrenList] = useState([]);
  const { user, isGuardian } = useContext(AuthContext);
  const { selectChild, child, selectedChildId } = useContext(ChildContext);
  const navigate = useNavigate();

  const fetchChildren = async () => {
    // if (user && !isGuardian) {
    const url = `http://localhost/api/children/members/66bf92531efa3ca393556096/`;
    // }
    // else{
    // const url = `http://localhost/api/children/guardians/66bf74d0e463457278b2ea36/`;
    // }

    try {
      const response = await customFetch(url);
      console.log("children", response);
      setChildrenList(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
      setChildrenList([]);
    }
  };

  const handleSelectChild = (childId) => {
    selectChild(childId);
    navigate("/home");
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gap: "16px",
        justifyItems: "center",
        alignItems: "center",
        width: "100%",
        padding: "16px",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        mt: "64px",
      }}
    >
      {childrenList.map((child) => {
        return (
          <Box
            onClick={() => handleSelectChild(child.id)}
            sx={{
              width: "300px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out", // Smooth transition
              "&:hover": {
                transform: "scale(1.1)", // Grow the image to 110% of its original size on hover
              },
            }}
          >
            <Img sx={{ width: "100%" }} src={child.profile_picture} />
            <H1 sx={{ textAlign: "center" }}>{child.name}</H1>
          </Box>
        );
      })}
    </Box>
  );
};

export default MemberLanding;
