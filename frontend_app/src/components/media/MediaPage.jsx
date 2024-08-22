import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import MediaBox from "./MediaBox";
// This is the page that will render a bunch of little Media boxes to click on for expanded view
const Img = styled("img")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const { child } = useContext(ChildContext);
  const fetchMedia = async () => {
    const url = `http://localhost/api/media/children/${child.id}`;
    try {
      const response = await customFetch(url);
      console.log("response: ", response);
      const processedMedia = response.media.map((media) => ({
        ...media,
        created_at: new Date(media.created_at),
      }));
      processedMedia.sort((a, b) => b.created_at - a.created_at);

      setMedia(processedMedia);
    } catch (error) {
      console.error("Error fetching media", error);
      setMedia([]);
    }
  };
  useEffect(() => {
    fetchMedia(); // Fetch media when id changes
  }, [child]);

  return (
    <Box
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: "64px",
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
        <h1>All media</h1>
        <Box
          sx={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // Adjust minmax value to control the photo size
            maxWidth: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "32px",
            marginBottom: "64px",
            "@media (max-width: 1200px)": {
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", // Adjust for medium screens
            },
            "@media (max-width: 900px)": {
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", // Adjust for small screens
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", // Adjust for very small screens
            },
          }}
        >
          {media.map((media) => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <StyledLink to={`/media/${media.id}`}>
                <Img sx={{ width: "100%", maxWidth: "300px", height: "auto" }} src={media.url} />
              </StyledLink>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MediaPage;
