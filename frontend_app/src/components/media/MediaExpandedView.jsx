import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Link } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";

const Img = styled("img")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const MediaExpandedView = () => {
  const [media, setMedia] = useState(null);

  const { id } = useParams();
  const fetchMedia = async () => {
    const url = `http://localhost/api/media/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setMedia(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching media", error);
    }
  };

  useEffect(() => {
    fetchMedia(); // Fetch media when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  return (
    <Box
      sx={{
        mt: "64px",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {media && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
            <Box sx={{ justifySelf: "start" }}>
              <StyledLink to='/media' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
                <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All media
              </StyledLink>
            </Box>
            <Category> {media.category}</Category>
          </Box>

          <Box
            sx={{
              width: "70%",
            }}
          >
            <Box>{formatDate(media.date, false)}</Box>
            <Img
              sx={{
                width: "65%",
                my: "16px",
              }}
              src={media.url}
            />
            <Box sx={{ mb: "32px", fontSize: "24px" }}>{media.description}</Box>
            <Box>
              <Comments id={id} type='media' />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MediaExpandedView;
