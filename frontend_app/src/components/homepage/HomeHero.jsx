import React, { useState, useContext } from "react";
import { ChildContext } from "../../context/ChildContext";
import { Box } from "@mui/material";
import { getAge } from "../../utils";
import { AuthContext } from "../../context/AuthContext";
import UpdateChild from "../forms/child/UpdateChild";
import { H1, H2, Img, Button } from "../typography/Styled";
import customFetch from "../../fetchWrapper";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { child, selectChild } = useContext(ChildContext);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const deleteChild = async () => {
    const url = `http://localhost/api/children/${child.id}`;
    const options = { method: "DELETE" };

    try {
      const response = await customFetch(url, options);
      console.log(response);
      selectChild("");
      navigate("/member_landing");
    } catch (error) {
      console.error("Error updating child: ", error);
    }
  };

  const age = getAge(child.birthdate);

  const years = age.years === 0 ? "" : age.years === 1 ? `${age.years} year and` : `${age.years} years and`;
  const months = age.months === 1 ? `${age.months} month old` : age.months > 0 ? `${age.months} months old` : "";
  const days = age.months === 0 && age.years === 0 ? `${age.days} days old` : ``;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: { xs: "column", lg: "row" },
        my: "64px",
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
        px: "32px",
      }}
    >
      {role === "guardian" && (
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            right: "16px",
          }}
        >
          <Button
            sx={{
              border: "none",
              backgroundColor: "orange",
              padding: "16px",
              mr: "16px",
              borderRadius: "10px",
              "& p": { my: 0 },

              "&:hover": {
                backgroundColor: "red",
                color: "white",
              },
            }}
            onClick={deleteChild}
          >
            Remove Child
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
            Update Child
          </Button>
        </Box>
      )}
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <Img
          sx={{ height: { xs: "auto", lg: "350px" }, width: { xs: "80vw", lg: "auto" } }}
          src={child.profile_picture}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: { xs: "24px", lg: 0 },
          ml: { xs: 0, lg: "32px", xl: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "center", lg: "start" },
            alignItems: { xs: "center", lg: "start" },
            width: "100%",
          }}
        >
          <H1 sx={{ fontSize: "64px", fontWeight: "bold", color: "#0088d1" }}>{child.name}</H1>

          <h2>
            {years} {months} {days}
          </h2>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", lg: "start" },
              justifyContent: "start",
            }}
          >
            {child.favorite_color && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: { xs: "center", lg: "start" } }}>
                <H2 sx={{ whiteSpace: "nowrap" }}>Favorite color: </H2>
                <Box sx={{ fontSize: "24px", ml: "16px" }}>{child.favorite_color}</Box>
              </Box>
            )}
            {child.current_thing && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: { xs: "column", lg: "row" },
                  alignItems: { xs: "center", lg: "start" },
                }}
              >
                {" "}
                <H2 sx={{ whiteSpace: "nowrap" }}>Latest Thing: </H2>
                <Box sx={{ fontSize: "24px", ml: "16px", width: { xs: "50vw", lg: "auto" } }}>
                  {child.current_thing}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <UpdateChild child={child} open={modalOpen} handleClose={handleClose} />
    </Box>
  );
};

export default HomeHero;
