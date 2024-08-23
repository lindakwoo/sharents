import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import customFetch from "../../fetchWrapper";
import { ChildContext } from "../../context/ChildContext";
import { formatDate } from "../../utils";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });

const HomeEvents = () => {
  const [events, setEvents] = useState([]);
  const { child } = useContext(ChildContext);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const url = `http://localhost/api/events/children/${child.id}`;
    try {
      const response = await customFetch(url);
      const today = new Date();
      const processedEvents = response.events.map((event) => ({
        ...event,
        datetime: new Date(event.datetime), // Convert to Date object
      }));

      const futureEvents = processedEvents.filter((event) => event.datetime >= today);
      futureEvents.sort((a, b) => a.datetime - b.datetime);

      const topThreeEvents = futureEvents.slice(0, 3);
      setEvents(topThreeEvents);
    } catch (error) {
      console.error("Error fetching events", error);
      setEvents([]);
    }
  };

  const handleRowClick = (eventId) => {
    // Navigate to the event details page
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    if (child.id) {
      fetchEvents(); // Fetch milestone when id changes
    }
  }, [child.id]);

  return (
    <Box
      sx={{
        backgroundColor: "#f8f8f8",
        padding: "64px",
        marginBottom: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          left: "0",
          width: "100%",
          height: "100px", // Height of the arc at the top
          backgroundColor: "white", // Match the background color of the div
          borderRadius: "0 0 50% 50%",
          zIndex: 300,
        }}
      ></Box>
      <Box
        sx={{
          content: '""',
          position: "absolute",
          bottom: "-50px",
          left: "-200px",
          width: "150%",
          height: "200px", // Height of the arch
          backgroundColor: "white", // Match the background color of the div
          borderRadius: "70% 70% 0 0", // Arched bottom effect
          transform: "translateY(50%)",
          zIndex: 300,
        }}
      ></Box>
      <Box
        sx={{
          width: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "& h1": { marginBottom: "48px" },
        }}
      >
        <h1>Upcoming Events</h1>
        <Box
          sx={{ marginBottom: "64px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {events.length > 0 && (
            <TableContainer sx={{ width: "60%" }} component={Paper}>
              <Table sx={{ wdith: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "aqua",
                        },
                      }}
                      key={event.id}
                      hover
                      onClick={() => handleRowClick(event.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{formatDate(event.datetime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {events.length === 0 && <Box>There are no events for this child</Box>}
        </Box>
      </Box>
      {events.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end", alignSelf: "end" }}>
          <StyledLink to='/events' sx={{ backgroundColor: "orange", padding: "16px", borderRadius: "10px" }}>
            All events <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
          </StyledLink>
        </Box>
      )}
    </Box>
  );
};

export default HomeEvents;
