import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Link } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";

const Img = styled("img")({});
const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});
const H3 = styled("h3")({});

const MediaExpandedView = () => {
  const [media, setMedia] = useState(null);
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    const url = `http://localhost/api/media/${id}/comments/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setComments(response.comments);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  useEffect(() => {
    fetchMedia(); // Fetch media when id changes
  }, [id]); // Dependency array ensures this runs only when `id` changes

  useEffect(() => {
    fetchComments(); // Fetch media when id changes
  }, [id]);

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
          <Box>{formatDate(media.date, false)}</Box>
          <Box
            sx={{
              width: "70%",
            }}
          >
            <Img
              sx={{
                width: "80%",
              }}
              src={media.url}
            />
            <Box>{media.description}</Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                {" "}
                <h2>Comments:</h2>{" "}
                <Button
                  sx={{
                    border: "none",
                    backgroundColor: "yellow",
                    padding: "8px",
                    borderRadius: "10px",
                    "& p": { my: 0 },
                    maxHeight: "50px",
                    "&:hover": {
                      backgroundColor: "orange",
                      color: "white",
                    },
                  }}
                >
                  <p>Add a comment</p>
                </Button>
              </Box>
              {/* <Box sx={{ width: "80%" }}> */}
              {comments.length > 0 &&
                comments.map((comment) => {
                  return (
                    <Box
                      sx={{
                        boxSizing: "border-box",
                        width: "80%",
                        border: "black 1px solid",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      {comment.text}
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MediaExpandedView;
