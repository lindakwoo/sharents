import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static' sx={{ backgroundColor: "#007bff" }}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Sharents
        </Typography>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Button color='inherit'>Home</Button>
          <Button color='inherit'>Sign up</Button>
          <Button color='inherit'>Login</Button>
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem onClick={handleMenuClose}>About</MenuItem>
          <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
