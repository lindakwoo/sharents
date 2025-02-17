"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteComment = exports.getAge = exports.formatDate = void 0;

var _fetchWrapper = _interopRequireDefault(require("./fetchWrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  var months = today.getMonth() - birthDate.getMonth();
  var days = today.getDate() - birthDate.getDate(); // If the current month is earlier than the birth month, adjust years and months

  if (months < 0) {
    years--;
    months += 12;
  } // If the current day of the month is earlier than the birth day, adjust months and days


  if (days < 0) {
    months--; // Get the number of days in the previous month

    var previousMonth = (today.getMonth() - 1 + 12) % 12;
    var previousMonthYear = previousMonth === 11 ? today.getFullYear() - 1 : today.getFullYear();
    var daysInPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0).getDate();
    days += daysInPreviousMonth; // Handle case where months go below zero

    if (months < 0) {
      years--;
      months += 12;
    }
  } // Return 0 for years, months, or days if they are 0


  return {
    years: years || 0,
    months: months || 0,
    days: days || 0
  };
};

exports.getAge = getAge;

var deleteComment = function deleteComment(commentId) {
  var url, options, response;
  return regeneratorRuntime.async(function deleteComment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(commentId);
          url = "http://localhost/api/comments/".concat(commentId);
          options = {
            method: "DELETE"
          };
          console.log(url);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _fetchWrapper["default"])(url, options));

        case 7:
          response = _context.sent;
          console.log(response);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.error("Error deleting comment: ", _context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
};

exports.deleteComment = deleteComment;