"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledSelect = exports.Input = exports.Button = exports.P = exports.H3 = exports.H2 = exports.H1 = exports.StyledLink = exports.IFrame = exports.Img = void 0;

var _material = require("@mui/material");

var _reactRouterDom = require("react-router-dom");

var Img = (0, _material.styled)("img")({});
exports.Img = Img;
var IFrame = (0, _material.styled)("iframe")({});
exports.IFrame = IFrame;
var StyledLink = (0, _material.styled)(_reactRouterDom.Link)({
  textDecoration: "none",
  color: "inherit"
});
exports.StyledLink = StyledLink;
var H1 = (0, _material.styled)("h1")({});
exports.H1 = H1;
var H2 = (0, _material.styled)("h2")({});
exports.H2 = H2;
var H3 = (0, _material.styled)("h3")({});
exports.H3 = H3;
var P = (0, _material.styled)("p")({});
exports.P = P;
var Button = (0, _material.styled)("button")({});
exports.Button = Button;
var Input = (0, _material.styled)("input")({});
exports.Input = Input;
var StyledSelect = (0, _material.styled)("select")({
  appearance: "none",
  // Remove default browser styling for select items
  width: "100%",
  padding: "8px 40px 8px 8px",
  borderRadius: "4px",
  background: "url('data:image/svg+xml;utf8,<svg fill=\"%23000000\" height=\"32\" viewBox=\"0 0 24 24\" width=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat",
  // Custom dropdown arrow (enlarged)
  backgroundSize: "24px",
  // size of the icon
  backgroundPosition: "calc(100% - 4px) center",
  // Move icon 4px from the right
  backgroundColor: "white",
  fontSize: "16px"
});
exports.StyledSelect = StyledSelect;