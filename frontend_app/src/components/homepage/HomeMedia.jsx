import React, { useState, useContext, useEffect } from "react";
import { ChildContext } from "../../context/ChildContext";
import { Box, styled } from "@mui/material";

const HomeMedia = () => {
  const { child } = useContext(ChildContext);

  const fetchMedia = async ()=>{
    const url =
  }


  const age = getAge(child.birthdate);

  return (
    <></>
  )
}

export default HomeMedia
