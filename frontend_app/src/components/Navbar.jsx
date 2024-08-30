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
import { StyledLink, StyledSelect, Img } from "./typography/Styled";
import DesktopMenuItem from "./DesktopMenuItem";
import MobileMenuItem from "./MobileMeniItem";

const Button = styled("button")({
  border: "none",
  color: "white",
  padding: "16px",
  backgroundColor: "transparent",
  fontWeight: "bold",
  "&:hover": { color: "yellow" },
});

const Navbar = () => {
  const { user, role, logout, setIsLogin, setIsSignup, isAuth } = useContext(AuthContext);
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
  }, [user, child]);

  return (
    <AppBar position='static' sx={{ backgroundColor: "#0288d1" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "start", alignItems: "center" }}>
          <Img src='./logo.png' sx={{ height: "70px", width: "auto" }} />
          <Typography
            variant='h6'
            sx={{
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            <StyledLink
              sx={{
                "&:hover": { color: "yellow" },
              }}
              to='/'
            >
              Sharents
            </StyledLink>
          </Typography>
        </Box>

        {childrenList.length > 0 && isAuth && (
          <Box sx={{ minWidth: 120, mr: { xs: "100px", md: "0px" } }}>
            <StyledSelect sx={{ border: "none" }} value={selectedChildId || ""} onChange={handleChildChange}>
              <option value=''>Select Child</option>
              {childrenList.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </StyledSelect>
          </Box>
        )}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          {child && <DesktopMenuItem path='/home' onClickHandler={() => {}} title='Home' />}
          {!user && (
            <DesktopMenuItem path='/' onClickHandler={() => setIsSignup(true)} title='Signup' highlight={false} />
          )}
          {!user && (
            <DesktopMenuItem path='/' onClickHandler={() => setIsLogin(true)} title='Login' highlight={false} />
          )}
          {user && <DesktopMenuItem path='#' onClickHandler={handleLogout} title='Logout' />}
          {role === "guardian" && child && (
            <DesktopMenuItem path='/guardian_dashboard' onClickHandler={() => {}} title='Dashboard' />
          )}
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {child && <MobileMenuItem path='/home' onClickHandler={handleMenuClose} title='Home' />}

          {!user && <MobileMenuItem path='/' onClickHandler={handleSignup} title='Signup' highlight={false} />}
          {!user && <MobileMenuItem path='/' onClickHandler={handleLogin} title='Login' highlight={false} />}
          {user && <MobileMenuItem path='/' onClickHandler={handleLogout} title='Logout' highlight={false} />}
          {role === "guardian" && child && (
            <MobileMenuItem path='/guardian_dashboard' onClickHandler={handleMenuClose} title='Dashboard' />
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
