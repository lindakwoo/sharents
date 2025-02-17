import React, { useState, useContext, useEffect } from "react";
import customFetch from "../fetchWrapper";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";
import { P, Img } from "./typography/Styled";
import CreateChild from "./forms/child/CreateChild";

const MemberLanding = () => {
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useContext(AuthContext);
  const { selectChild } = useContext(ChildContext);
  const navigate = useNavigate();

  const fetchChildren = async () => {
    let url;
    if (user && role === "member") {
      url = `http://localhost/api/children/members/${user}/`;
    } else if (user && role === "guardian") {
      url = `http://localhost/api/children/guardians/${user}/`;
    } else {
      return;
    }

    try {
      const response = await customFetch(url);
      setChildrenList(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
      setChildrenList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    selectChild(childId);
    navigate("/home");
  };

  useEffect(() => {
    fetchChildren();
  }, [user]);

  return (
    <Box
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        my: "64px",
      }}
    >
      <Box
        sx={{
          width: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {childrenList.length > 0 ? (
              <>
                <h1>Select a child to view</h1>
                <Box
                  sx={{
                    display: "grid",
                    gap: "24px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    maxWidth: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "64px",
                    marginBottom: "64px",
                    "@media (max-width: 1200px)": {
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    },
                    "@media (max-width: 900px)": {
                      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    },
                    "@media (max-width: 600px)": {
                      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    },
                  }}
                >
                  {childrenList.map((child) => (
                    <Box
                      key={child.id}
                      onClick={() => handleSelectChild(child.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Img sx={{ width: "100%", maxWidth: "300px", height: "auto" }} src={child.profile_picture} />
                      <P sx={{ textAlign: "center", fontSize: "24px" }}>{child.name}</P>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              role === "guardian" && <CreateChild />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MemberLanding;
