import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";
import { AuthContext } from "../../context/AuthContext";
import UpdateMedia from "../forms/media/UpdateMedia";
import { deleteComment } from "../../utils";
import { Button, Img } from "../typography/Styled";

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
    const commentsUrl = `http://localhost/api/media/${id}/comments/`;
    const options = { method: "DELETE" };
    try {
      const commentsResponse = await customFetch(commentsUrl);
      const comments = commentsResponse.comments;
      if (comments.length > 0) {
        for (let comment of comments) {
          deleteComment(comment.id);
        }
      }
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", lg: "row" },
              width: "70%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                mt: { xs: "10px" },
                mb: { xs: "10px" },
              }}
            >
              <Button
                onClick={() => navigate("/media")}
                sx={{
                  backgroundColor: "orange",
                  border: "none",
                  padding: "16px",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#0288d1",
                    color: "white",
                  },
                }}
              >
                <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All media
              </Button>
              {role === "guardian" && (
                <>
                  <Button
                    sx={{
                      border: "none",
                      backgroundColor: "orange",
                      mx: "16px",
                      padding: "16px",
                      borderRadius: "10px",

                      "& p": { my: 0 },
                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={deleteMedia}
                  >
                    Delete Media
                  </Button>
                  <Button
                    sx={{
                      border: "none",
                      backgroundColor: "orange",
                      padding: "16px",
                      borderRadius: "10px",
                      "& p": { my: 0 },
                      "&:hover": {
                        backgroundColor: "yellow",
                        color: "#0288d1",
                        fontWeight: "bold",
                      },
                    }}
                    onClick={handleOpen}
                  >
                    Update Media
                  </Button>
                </>
              )}
            </Box>
            <Category>{media.category}</Category>
          </Box>
          {media.type === "photo" && (
            <Box sx={{ width: "70%" }}>
              <Box>{formatDate(media.date, false)}</Box>
              <Img sx={{ width: "65%", my: "16px" }} src={media.url} />
              <Box sx={{ mb: "32px", fontSize: "24px" }}>{media.description}</Box>
              <Box>
                <Comments id={id} type='media' />
              </Box>
            </Box>
          )}
          {media.type === "video" && (
            <Box sx={{ width: "70%" }}>
              <Box>{formatDate(media.date, false)}</Box>
              <iframe
                width='899'
                height='471'
                src={media.url}
                title={media.description}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              ></iframe>
              <Box sx={{ mb: "32px", fontSize: "24px" }}>{media.description}</Box>
              <Box>
                <Comments id={id} type='media' />
              </Box>
            </Box>
          )}
          <UpdateMedia fetchMedia={fetchMedia} media={media} open={modalOpen} handleClose={handleClose} id={id} />
        </>
      )}
    </Box>
  );
};

export default MediaExpandedView;
