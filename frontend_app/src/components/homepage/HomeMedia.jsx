import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";

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
  }
  useEffect(() => {
    fetchMedia(); // Fetch media when id changes
  }, [child]);

  return (
    <Box>
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
            {media.description}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default HomeMedia
