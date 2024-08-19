import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChildContext } from "../../context/ChildContext";
import HomeHero from "./HomeHero";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { child } = useContext(ChildContext);
  return (
    <>
      <HomeHero />
    </>
  );
};

export default Home;
