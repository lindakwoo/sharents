import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Link } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";
import { AuthContext } from "../../context/AuthContext";
import UpdateMedia from "../forms/media/UpdateMedia";

const Img = styled("img")({});
const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const MediaExpandedView = () => {
  const [media, setMedia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const deleteMedia = async () => {
    const url = `http://localhost/api/media/${id}`;
    const options = { method: "DELETE" };
    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/media");
    } catch (error) {
      console.error("Error deleting media: ", error);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

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
              <StyledLink
                to='/media'
                sx={{
                  backgroundColor: "orange",
                  padding: "16px",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#0288d1",
                    color: "white",
                  },
                }}
              >
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
          {role === "guardian" && (
            <Box sx={{ position: "fixed", bottom: "16px", right: "16px" }}>
              <Button
                sx={{
                  border: "none",
                  backgroundColor: "red",
                  mr: "16px",
                  color: "white",
                  padding: "8px",
                  borderRadius: "10px",
                  "& p": { my: 0 },
                  maxHeight: "50px",
                  "&:hover": {
                    backgroundColor: "#0288d1",
                    color: "white",
                  },
                }}
                onClick={deleteMedia}
              >
                Delete Media
              </Button>{" "}
              <Button
                sx={{
                  border: "none",
                  backgroundColor: "yellow",
                  padding: "8px",
                  borderRadius: "10px",
                  "& p": { my: 0 },
                  maxHeight: "50px",
                  "&:hover": {
                    backgroundColor: "#0288d1",
                    color: "white",
                  },
                }}
                onClick={handleOpen}
              >
                Update Media
              </Button>
            </Box>
          )}
          <UpdateMedia fetchMedia={fetchMedia} media={media} open={modalOpen} handleClose={handleClose} id={id} />
        </>
      )}
    </Box>
  );
};

export default MediaExpandedView;
