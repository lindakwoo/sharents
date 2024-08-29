import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChildContext } from "../../context/ChildContext";
import HomeHero from "./HomeHero";
import HomeMilestones from "./milestones/HomeMilestones";
import HomeEvents from "./HomeEvents";
import HomeMedia from "./HomeMedia";

const Home = () => {
  const { child } = useContext(ChildContext);

  if (!child) {
    return null;
  }
  return (
    <>
      <HomeHero />
      <HomeMilestones />
      <HomeMedia />
      <HomeEvents />
    </>
  );
};

export default Home;
