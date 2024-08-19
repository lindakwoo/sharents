"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const refreshAccessToken = async () => {
//     const refreshToken = localStorage.getItem("refresh_token");
//     try {
//         const response = await fetch("http://localhost:8000/api/token/refresh/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ refresh: refreshToken }),
//         });
//         if (!response.ok) {
//             throw new Error("Failed to refresh access token");
//         }
//         const data = await response.json();
//         localStorage.setItem("access_token", data.access);
//         return data.access;
//     } catch (error) {
//         console.error("Error refreshing access token:", error);
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("user");
//         window.location.href = "/login";  // Redirect to login
//         throw error;
//     }
// };
var customFetch = function customFetch(url) {
  var options,
      accessToken,
      fetchOptions,
      response,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function customFetch$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          accessToken = localStorage.getItem("access_token");
          fetchOptions = _objectSpread({}, options, {
            headers: _objectSpread({}, options.headers, {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken)
            })
          });
          console.log(fetchOptions);
          _context.prev = 4;
          console.log("inside the fetch");
          _context.next = 8;
          return regeneratorRuntime.awrap(fetch(url, fetchOptions));

        case 8:
          response = _context.sent;

          if (response.ok) {
            _context.next = 11;
            break;
          }

          throw new Error("HTTP error! status: ".concat(response.status));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(response.json());

        case 13:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](4);
          console.error("Error during fetch:", _context.t0);
          throw _context.t0;

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 17]]);
};

var _default = customFetch;
exports["default"] = _default;