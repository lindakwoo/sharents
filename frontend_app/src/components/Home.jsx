import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChildContext } from "../context/ChildContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { child } = useContext(ChildContext);
  return <div>The current child: {child.name}</div>;
};

export default Home;
