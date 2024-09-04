import React, { useState, useContext, useEffect } from "react";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { AuthContext } from "../../context/AuthContext";
import { Box } from "@mui/material";
import Category from "../Category";
import { IFrame, Img, StyledLink } from "../typography/Styled";
import { StyledSelect } from "../typography/Styled";
import { useNavigate } from "react-router-dom";

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [category, setCategory] = useState("");
  const { child } = useContext(ChildContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchMedia = async () => {
    const url = `http://localhost/api/media/children/${child.id}`;
    try {
      const response = await customFetch(url);
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
    if (child) {
      fetchMedia();
    }
    // Fetch media when id changes
  }, [child]);

  useEffect(() => {
    filterByCategory(); // Filter media when category changes
  }, [category, media]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  return child ? (
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
              <StyledSelect
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
              </StyledSelect>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                  width: "100%",
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
                      <Img sx={{ width: "100%", maxWidth: "300px", height: "auto" }} src={media.url} />
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
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StyledLink to={`/media/${media.id}`}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            overflow: "hidden",
                            pointerEvents: "none", // Prevent interaction with the iframe
                          }}
                        >
                          <IFrame
                            sx={{ width: "100%", maxWidth: "300px", height: "auto", pointerEvents: "none" }}
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
        {filteredMedia.length === 0 && media.length > 0 && (
          <Box>{`There are no media in the ${category} category `}</Box>
        )}
        {media.length === 0 && <Box>There are no photos or videos for this child</Box>}
      </Box>
    </Box>
  ) : null;
};

export default MediaPage;
