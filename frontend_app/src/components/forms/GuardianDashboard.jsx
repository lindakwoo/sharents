import React, { useState } from "react";
import { Box, styled, Menu, MenuItem } from "@mui/material";
import CreateChild from "./child/CreateChild";
import CreateEvent from "./events/CreateEvent";
import CreateMedia from "./media/CreateMedia";
import CreateMilestone from "./milestones/CreateMilestone";
import InviteMember from "./InviteMember";

const Button = styled("button")({
  border: "none",
  backgroundColor: "orange",
  padding: "16px",
  margin: "16px",
  borderRadius: "10px",
  "&:hover": { backgroundColor: "yellow" },
});

// These are all the things a guardian can do
// This component will render different form components, based on the button selected...
const GuardianDashboard = () => {
  const [action, setAction] = useState("milestone");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ display: { xs: "none", lg: "flex" }, justifyContent: "center", alignItems: "center" }}>
        <Button
          onClick={() => {
            setAction("milestone");
          }}
        >
          {" "}
          Add a new milestone
        </Button>
        <Button onClick={() => setAction("media")}> Add new media</Button>
        <Button onClick={() => setAction("event")}> Add a new event</Button>
        <Button onClick={() => setAction("child")}> Add another child</Button>
        <Button onClick={() => setAction("invite")}> Invite a member</Button>
      </Box>

      <Box
        sx={{
          display: {
            xs: "flex",
            lg: "none",
          },
          m: "8px",
        }}
      >
        <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
          Select an option
        </Button>
        <Menu id='simple-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              setAction("milestone");
              handleClose();
            }}
          >
            {" "}
            Add a new milestone
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAction("media");
              handleClose();
            }}
          >
            {" "}
            Add new media
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAction("event");
              handleClose();
            }}
          >
            {" "}
            Add a new event
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAction("child");
              handleClose();
            }}
          >
            {" "}
            Add another child
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAction("invite");
              handleClose();
            }}
          >
            {" "}
            Invite a member
          </MenuItem>
        </Menu>
      </Box>
      <Box sx={{ mt: { xs: "32px", lg: "128px" }, width: { xs: "90%", md: "50%" } }}>
        {action === "milestone" ? (
          <CreateMilestone />
        ) : action === "media" ? (
          <CreateMedia />
        ) : action === "event" ? (
          <CreateEvent />
        ) : action === "invite" ? (
          <InviteMember />
        ) : (
          <CreateChild />
        )}
      </Box>
    </Box>
  );
};

export default GuardianDashboard;
