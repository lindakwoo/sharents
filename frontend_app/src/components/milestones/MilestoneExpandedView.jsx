import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import customFetch from "../../fetchWrapper";
import { Box, styled } from "@mui/material";
import { formatDate } from "../../utils";
import { ArrowBack } from "@mui/icons-material";
import Category from "../Category";
import Comments from "../comments/Comments";
import UpdateMilestone from "../forms/milestones/UpdateMilestone";
import { AuthContext } from "../../context/AuthContext";


const Button = styled("button")({});
const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const H1 = styled("h1")({});
const H2 = styled("h2")({});

const MilestoneExpandedView = () => {
  const [milestone, setMilestone] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchMilestone = async () => {
    const url = `http://localhost/api/milestones/${id}/`;
    try {
      const response = await customFetch(url);
      console.log("response", response);
      setMilestone(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching milestone", error);
    }
  };

  const deleteMilestone = async () => {
    const url = `http://localhost/api/milestones/${id}`;
    const options = { method: "DELETE" };
    try {
      const response = await customFetch(url, options);
      console.log(response);
      navigate("/milestones");
    } catch (error) {
      console.error("Error deleting milestone: ", error);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  useEffect(() => {
    fetchMilestone(); // Fetch milestone when id changes
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
      {milestone && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
            <Box sx={{ justifySelf: "start" }}>
              <StyledLink
                to='/milestones'
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
                <ArrowBack style={{ marginRight: 8, verticalAlign: "middle" }} /> All milestones
              </StyledLink>
            </Box>
            <Category> {milestone.category}</Category>
          </Box>
          <Box
            sx={{
              width: "70%",
            }}
          >
            <Box>{formatDate(milestone.date, false)}</Box>
            <H1 sx={{ fontSize: "64px", my: "8px" }}>{milestone.name}</H1>
            <H2 sx={{ fontSize: "32px", my: "8px", mb: "32px" }}>{milestone.description}</H2>
            <Box sx={{ mb: "64px" }}>
              <Comments id={id} type='milestone' />
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
                onClick={deleteMilestone}
              >
                Delete Milestone
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
                Update Milestone
              </Button>
            </Box>
          )}

          <UpdateMilestone
            fetchMilestone={fetchMilestone}
            milestone={milestone}
            open={modalOpen}
            handleClose={handleClose}
            id={id}
          />
        </>
      )}
    </Box>
  );
};

export default MilestoneExpandedView;
