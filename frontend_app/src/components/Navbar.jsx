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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material";
import { StyledLink, StyledSelect } from "./typography/Styled";

const Button = styled("button")({
  border: "none",
  color: "white",
  padding: "16px",
  backgroundColor: "transparent",
  fontWeight: "bold",
  "&:hover": { color: "yellow" },
});

const Navbar = () => {
  const { user, role, logout, setIsLogin, setIsSignup } = useContext(AuthContext);
  const { selectChild, child, selectedChildId } = useContext(ChildContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleLogin = () => {
    setIsLogin(true);
    handleMenuClose();
    navigate("/");
  };

  const handleSignup = () => {
    setIsSignup(true);
    handleMenuClose();
    navigate("/");
  };

  const fetchChildren = async () => {
    let url;
    if (user && role === "member") {
      url = `http://localhost/api/children/members/${user}/`;
    } else if (user && role === "guardian") {
      url = `http://localhost/api/children/guardians/${user}/`;
    } else {
      console.log("there is no user");
    }

    try {
      const response = await customFetch(url);
      setChildrenList(response.children);
    } catch (error) {
      console.error("Error fetching children", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  return (
    <AppBar position='static' sx={{ backgroundColor: "#0288d1" }}>
      <Toolbar>
        <Typography variant='h6'
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontSize: "24px"
          }}>
          <StyledLink sx={{
            "&:hover": { color: "yellow" }
          }} to='/'>
            Sharents
          </StyledLink>
        </Typography>

        {childrenList.length > 0 && (
          <Box sx={{ minWidth: 120, mr: { xs: "100px", md: "0px" } }}>
            <StyledSelect value={selectedChildId || ""} onChange={handleChildChange}>
              <option value=''>Select Child</option>
              {childrenList.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </StyledSelect>
          </Box>
        )}
        <Box sx={{
          display: { xs: "none", md: "block" },

        }}>
          {child && (
            <Button
              sx={{
                "&:hover": { color: "yellow" },
                color: location.pathname === "/home" ? "yellow" : "white",
                backgroundColor: location.pathname === "/home" ? "#077eba" : "transparent"
              }} color='inherit'>
              {" "}
              <StyledLink to='/home'>
                Home
              </StyledLink>
            </Button>
          )}

          {!user && (
            <Button color='inherit' onClick={() => setIsSignup(true)}>
              {" "}
              <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='/'>
                Signup
              </StyledLink>
            </Button>
          )}
          {!user && (
            <Button color='inherit' onClick={() => setIsLogin(true)}>
              {" "}
              <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='/'>
                Login
              </StyledLink>
            </Button>
          )}
          {user && (
            <Button color='inherit' onClick={handleLogout}>
              {" "}
              <StyledLink sx={{ "&:hover": { color: "yellow" } }} to='#'>
                Logout
              </StyledLink>
            </Button>
          )}
          {role === "guardian" && child && (
            <Button sx={{
              "&:hover": { color: "yellow" },
              color: location.pathname === "/guardian_dashboard" ? "yellow" : "white",
              backgroundColor: location.pathname === "/guardian_dashboard" ? "#077eba" : "transparent"
            }}>
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
          {child && (
            <MenuItem
              sx={{
                backgroundColor: location.pathname === "/home" ? "#dce0e2" : "transparent"
              }}
              onClick={handleMenuClose}>
              {" "}
              <StyledLink to='/home'>Home</StyledLink>
            </MenuItem>
          )}
          {!user && (
            <MenuItem onClick={handleSignup}>
              {" "}
              <StyledLink to='/signup'>Signup</StyledLink>
            </MenuItem>
          )}
          {!user && (
            <MenuItem onClick={handleLogin}>
              {" "}
              <StyledLink>Login</StyledLink>
            </MenuItem>
          )}
          {user && (
            <MenuItem onClick={handleLogout}>
              {" "}
              <StyledLink>Logout</StyledLink>
            </MenuItem>
          )}
          {role === "guardian" && child && (
            <MenuItem
              sx={{
                backgroundColor: location.pathname === "/guardian_dashboard" ? "#dce0e2" : "transparent"
              }}
              onClick={handleMenuClose}>
              {" "}
              <StyledLink to='/guardian_dashboard'>Dashboard</StyledLink>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar >
  );
};

export default Navbar;
