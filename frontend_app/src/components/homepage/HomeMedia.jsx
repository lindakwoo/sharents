import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

const Img = styled("img")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeMedia = () => {
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

      const topThreeMedia = processedMedia.slice(0, 3);
      setMedia(topThreeMedia);
    } catch (error) {
      console.error("Error fetching media", error);
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
        <h1>Latest media</h1>
        <Box
          sx={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "1fr 1fr 1fr",
            marginTop: "32px",
            marginBottom: "64px",
          }}
        >
          {media.map((media) => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <StyledLink to={`/media/${media.id}`}>
                <Img sx={{ width: "80%" }} src={media.url} />
              </StyledLink>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "end", alignSelf: "end" }}>
        <StyledLink to='/media' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
          All media <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
        </StyledLink>
      </Box>
    </Box>
  );
};

export default HomeMedia;
