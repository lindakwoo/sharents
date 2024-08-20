import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";
import customFetch from "../fetchWrapper";
import { Link, useNavigate } from "react-router-dom";
import { styled, Box } from "@mui/material";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const Img = styled("img")({});

const MemberLanding = () => {
  const [childrenList, setChildrenList] = useState([]);
  const fetchChildren = async () => {
    // if (user && !isGuardian) {
    const url = `http://localhost/api/children/members/66bf92531efa3ca393556096/`;
    // }
    // else{
    //   const url=`http://localhost/api/children/guardians/${user.id}/`
    // }

    try {
      const response = await customFetch(url);
      setChildrenList(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <Box sx={{ display: "grid", alignItems: "center", justifyContent: "center" }}>
      {childrenList.map((child) => {
        return <Img sx={{ width: "300px" }} src={child.profile_picture} />;
      })}
    </Box>
  );
};

export default MemberLanding;
