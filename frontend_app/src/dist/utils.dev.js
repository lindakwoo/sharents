"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAge = exports.formatDate = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var formatDate = function formatDate(date) {
  var withTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var dateObj = new Date(date); // const hasTime = dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0;

  var options = _objectSpread({
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }, withTime && {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};

exports.formatDate = formatDate;

var getAge = function getAge(birthdate) {
  var today = new Date();
  var birthDate = new Date(birthdate);
  var years = today.getFullYear() - birthDate.getFullYear();
  var months = today.getMonth() - birthDate.getMonth(); // If the current month is earlier than the birth month, adjust years and months

  if (months < 0) {
    years--;
    months += 12;
  } // If the current day of the month is earlier than the birth day, adjust months


  if (today.getDate() < birthDate.getDate()) {
    months--; // Handle case where months go below zero

    if (months < 0) {
      years--;
      months += 12;
    }
  } // Return 0 for years or months if they are 0


  return {
    years: years || 0,
    months: months || 0
  };
};

exports.getAge = getAge;