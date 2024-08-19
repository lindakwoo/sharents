import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";
import customFetch from "../fetchWrapper";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, isGuardian } = useContext(AuthContext);
  const { selectChild, child } = useContext(ChildContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(child?.id || "");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChildChange = (event) => {
    const childId = event.target.value;
    setSelectedChildId(childId);
    selectChild(childId);
  };

  const fetchChildren = async () => {
    // if (user && !isGuardian) {
    // const url = `http://localhost/api/children/members/${id}/children`;
    const url = `http://localhost/api/children`;
    try {
      const response = await customFetch(url);
      setChildrenList(response.children);
      console.log(response);
    } catch (error) {
      console.error("Error fetching children", error);
    }
    // }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <AppBar position='static' sx={{ backgroundColor: "#007bff" }}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Sharents
        </Typography>
        {childrenList.length > 0 && (
          <Box sx={{ minWidth: 120 }}>
            <select
              value={selectedChildId}
              onChange={handleChildChange}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value=''>Select Child</option>
              {childrenList.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </Box>
        )}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Button color='inherit'>
            {" "}
            <Link to='/home' style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
          </Button>
          <Button color='inherit'>
            {" "}
            <Link to='/signup' style={{ textDecoration: "none", color: "inherit" }}>
              Signup
            </Link>
          </Button>
          <Button color='inherit'>
            {" "}
            <Link to='/login' style={{ textDecoration: "none", color: "inherit" }}>
              Login
            </Link>
          </Button>
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <Link to='/home' style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <Link to='/signup' style={{ textDecoration: "none", color: "inherit" }}>
              Signup
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <Link to='/login' style={{ textDecoration: "none", color: "inherit" }}>
              Login
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
