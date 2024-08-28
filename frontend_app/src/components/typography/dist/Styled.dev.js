"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = exports.Button = exports.H3 = exports.H2 = exports.H1 = exports.StyledLink = exports.IFrame = exports.Img = void 0;

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
var Button = (0, _material.styled)("button")({});
exports.Button = Button;
var Input = (0, _material.styled)("input")({});
exports.Input = Input;