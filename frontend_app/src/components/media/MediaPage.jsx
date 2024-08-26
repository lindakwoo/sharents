import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import MediaBox from "./MediaBox";
import Category from "../Category";
// This is the page that will render a bunch of little Media boxes to click on for expanded view
const Img = styled("img")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const Select = styled("select")({
  appearance: "none", // Remove default browser styling for select items
  width: "100%",
  padding: "8px 40px 8px 8px",
  borderRadius: "4px",
  background: `url('data:image/svg+xml;utf8,<svg fill="%23000000" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat`, // Custom dropdown arrow (enlarged)
  backgroundSize: "24px", // size of the icon
  backgroundPosition: "calc(100% - 4px) center", // Move icon 4px from the right
  backgroundColor: "white",
  fontSize: "16px",
});

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [category, setCategory] = useState("");
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

  const filterByCategory = () => {
    if (category === "") {
      setFilteredMedia(media);
    } else {
      const filtered = media.filter((media) => media.category === category);
      setFilteredMedia(filtered);
    }
  };
  useEffect(() => {
    fetchMedia(); // Fetch media when id changes
  }, [child]);

  useEffect(() => {
    filterByCategory(); // Filter media when category changes
  }, [category, media]);

  return (
    <Box
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: "64px",
        padding: "64px",
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
        <Box
          sx={{
            mt: "16px",
          }}
          className='form-group'
        >
          <form>
            <Box
              sx={{
                mt: "16px",
              }}
              className='form-group'
            >
              <Select
                className='form-control'
                value={category}
                required
                name='category'
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                placeholder='filter by category'
              >
                <option value=''>filter by category</option>
                <option value=''>all categories</option>
                <option value='growth'>growth</option>
                <option value='food'>food</option>
                <option value='health'>health</option>
                <option value='speech'>speech</option>
                <option value='physical'>physical</option>
                <option value='cognitive'>cognitive</option>
                <option value='other'>other</option>
              </Select>
            </Box>
          </form>
        </Box>{" "}
        <h1>All media</h1>
        {media.length > 0 && (
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
            {filteredMedia.map((media) => (
              <Box sx={{ position: "relative" }}>
                <Category size='small' sx={{ position: "absolute", top: "8px", left: "8px" }}>
                  {media.category}
                </Category>
                <StyledLink to={`/media/${media.id}`}>
                  <Img sx={{ width: "100%", maxWidth: "300px", height: "auto" }} src={media.url} />
                </StyledLink>
              </Box>
            ))}
          </Box>
        )}
        {filteredMedia.length === 0 && media.length > 0 && (
          <Box>{`There are no media in the ${category} category `}</Box>
        )}
        {media.length === 0 && <Box>There are no photos or videos for this child</Box>}
      </Box>
    </Box>
  );
};

export default MediaPage;
