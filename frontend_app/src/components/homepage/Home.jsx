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
  const navigate = useNavigate();


  useEffect(() => {
    if (!child) {
      navigate('/member_landing');
    }
  }, [child, navigate]);

  if (!child) {
    // Return null or a loading spinner while redirecting
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
