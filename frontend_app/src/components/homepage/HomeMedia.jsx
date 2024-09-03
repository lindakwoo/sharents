import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import Category from "../Category";
import { StyledLink, Img, IFrame } from "../typography/Styled";

const HomeMedia = () => {
  const [media, setMedia] = useState([]);
  const { child } = useContext(ChildContext);

  const fetchMedia = async () => {
    const url = `http://localhost/api/media/children/${child.id}`;
    try {
      const response = await customFetch(url);
      const processedMedia = response.media.map((media) => ({
        ...media,
        created_at: new Date(media.created_at),
      }));
      processedMedia.sort((a, b) => b.created_at - a.created_at);

      const topThreeMedia = processedMedia.slice(0, 3);
      setMedia(topThreeMedia.length ? topThreeMedia : []);
    } catch (error) {
      console.error("Error fetching media", error);
      setMedia([]);
    }
  };

  useEffect(() => {
    if (child.id) {
      fetchMedia(); // Fetch media when id changes
    }
  }, [child.id]);

  return (
    <Box
      sx={{
        padding: "16px",
        padding: "64px",
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
        <h1>Latest photos and videos</h1>
        {media.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
              marginTop: "32px",
              marginBottom: "64px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {media.map((media) => (
              <Box
                sx={{
                  display: "flex", // Add this line to enable flexbox
                  justifyContent: "start", // Centers content horizontally
                  alignItems: "center", //
                  position: "relative",
                  width: "100%", // Ensures it takes full width of grid item
                  height: "100%", //
                  transition: "transform 0.3s ease-in-out", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.1)", // Grow the image to 110% of its original size on hover
                  },
                }}
                key={media.id}
              >
                {media.type === "photo" && (
                  <>
                    <Category size='small' sx={{ position: "absolute", top: "8px", left: "8px" }}>
                      {media.category}
                    </Category>
                    <StyledLink to={`/media/${media.id}`}>
                      <Img sx={{ width: "80%" }} src={media.url} />
                    </StyledLink>
                  </>
                )}
                {media.type === "video" && (
                  <>
                    <Category size='small' sx={{ position: "absolute", top: "8px", left: "8px", zIndex: "500" }}>
                      {media.category}
                    </Category>
                    <Box
                      sx={{
                        backgroundColor: "black",
                        width: "80%",
                        height: "100%",
                        minHeight: { xs: "300px", lg: "0" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <StyledLink sx={{ width: "100%", height: "auto" }} to={`/media/${media.id}`}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "auto",

                            overflow: "hidden",
                            pointerEvents: "none", // Prevent interaction with the iframe
                          }}
                        >
                          <IFrame
                            sx={{ width: "100%", height: "auto", pointerEvents: "none" }}
                            src={media.url}
                            title={media.description}
                            allowFullScreen
                            referrerPolicy='strict-origin-when-cross-origin'
                          ></IFrame>
                        </Box>
                      </StyledLink>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
        {media.length === 0 && <Box>There are no photos or videos for this child</Box>}
      </Box>
      {media.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end", alignSelf: "end" }}>
          <StyledLink to='/media' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
            All media <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
          </StyledLink>
        </Box>
      )}
    </Box>
  );
};

export default HomeMedia;
