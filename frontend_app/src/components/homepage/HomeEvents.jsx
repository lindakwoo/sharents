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
    }
  };

  const handleRowClick = (eventId) => {
    // Navigate to the event details page
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    fetchEvents(); // Fetch milestone when id changes
  }, [child]);

  return (
    <Box
      sx={{
        backgroundColor: "#f8f8f8",
        padding: "16px",
        marginBottom: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
        <h1>Upcoming Events</h1>
        <Box
          sx={{ marginBottom: "64px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <TableContainer sx={{ wdith: "100%" }} component={Paper}>
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
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "end", alignSelf: "end" }}>
        <StyledLink to='/milestones' sx={{ backgroundColor: "yellow", padding: "16px", borderRadius: "10px" }}>
          All milestones <ArrowForward style={{ marginLeft: 8, verticalAlign: "middle" }} />
        </StyledLink>
      </Box>
    </Box>
  );
};

export default HomeEvents;
