import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChildContext } from "../../context/ChildContext";
import HomeHero from "./HomeHero";
import HomeMilestones from "./milestones/HomeMilestones";
import HomeEvents from "./HomeEvents";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { child } = useContext(ChildContext);
  return (
    <>
      <HomeHero />
      <HomeMilestones />
      <HomeEvents />
    </>
  );
};

export default Home;
