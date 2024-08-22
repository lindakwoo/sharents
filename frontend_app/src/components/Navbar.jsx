import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";
import customFetch from "../fetchWrapper";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material";

const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
const Button = styled("button")({
  border: "none",
  color: "white",
  padding: "16px",
  backgroundColor: "transparent",
  fontWeight: "bold",
  "&:hover": { color: "yellow" },
});

const Navbar = () => {
  const { user, isGuardian } = useContext(AuthContext);
  const { selectChild, child, selectedChildId } = useContext(ChildContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChildChange = (event) => {
    const childId = event.target.value;
    selectChild(childId);
    navigate("/home");
  };

  const fetchChildren = async () => {
    // if (user && !isGuardian) {
    const url = `http://localhost/api/children/members/66bf92531efa3ca393556096/`;
    // }
    // else{
    //   const url=`http://localhost/api/children/guardians/${user}/`
    // }

    try {
      const response = await customFetch(url);
      console.log("from nav", response);
      setChildrenList(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
      setChildrenList([]);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <AppBar position='static' sx={{ backgroundColor: "#0288d1" }}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: "bold", fontSize: "24px" }}>
          Sharents
        </Typography>
        {childrenList.length > 0 && (
          <Box sx={{ minWidth: 120 }}>
            <select
              value={selectedChildId || ""}
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
            <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='/home'>
              Home
            </StyledLink>
          </Button>
          <Button color='inherit'>
            {" "}
            <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='/signup'>
              Signup
            </StyledLink>
          </Button>
          <Button color='inherit'>
            {" "}
            <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='/login'>
              Login
            </StyledLink>
          </Button>
          {isGuardian && (
            <Button sx={{ "&:hover": { color: "yellow" } }}>
              {" "}
              <StyledLink to='/guardian_dashboard'>Dashboard</StyledLink>
            </Button>
          )}
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <StyledLink to='/home'>Home</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <StyledLink to='/signup'>Signup</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            {" "}
            <StyledLink to='/login'>Login</StyledLink>
          </MenuItem>
          {isGuardian && (
            <MenuItem onClick={handleMenuClose}>
              {" "}
              <StyledLink to='/guardian_dashboard'>Dashboard</StyledLink>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
