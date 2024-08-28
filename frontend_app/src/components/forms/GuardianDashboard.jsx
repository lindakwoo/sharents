import React, { useState } from "react";
import { Box, styled } from "@mui/material";
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
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button onClick={() => setAction("milestone")}> Add a new milestone</Button>
        <Button onClick={() => setAction("media")}> Add new media</Button>
        <Button onClick={() => setAction("event")}> Add a new event</Button>
        <Button onClick={() => setAction("child")}> Add another child</Button>
        <Button onClick={() => setAction("invite")}> Invite a member</Button>
      </Box>
      <Box sx={{ mt: "128px", width: "50%" }}>
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
