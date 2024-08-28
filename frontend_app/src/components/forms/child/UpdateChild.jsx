import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customFetch from "../../../fetchWrapper";

import { Box, styled, Modal } from "@mui/material";

const Button = styled("button")({});

const UpdateChild = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box>update child form</Box>
    </Modal>
  );
};

export default UpdateChild;
