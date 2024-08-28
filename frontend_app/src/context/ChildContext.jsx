import React, { createContext, useState, useEffect } from "react";
import customFetch from "../fetchWrapper";

const ChildContext = createContext();

const ChildProvider = ({ children }) => {
  const [selectedChildId, setSelectedChildId] = useState(() => {
    return localStorage.getItem("selectedChildId") || null;
  });
  const [child, setChild] = useState({});

  const selectChild = async (id) => {
    setSelectedChildId(id);
    if (id) {
      try {
        const response = await customFetch(`http://localhost/api/children/${id}`);
        setChild(response); // Assuming the response contains the child's details
      } catch (error) {
        console.error("Error fetching child details", error);
      }
    } else {
      setChild(null);
    }
    localStorage.setItem("selectedChildId", id);
  };

  const updateChild = (updatedChild) => {
    setChild(updatedChild);
  };

  useEffect(() => {
    if (selectedChildId) {
      selectChild(selectedChildId); // Fetch details when ID changes
    }
  }, [selectedChildId]);

  return (
    <ChildContext.Provider value={{ selectChild, child, selectedChildId, updateChild }}>
      {children}
    </ChildContext.Provider>
  );
};

export { ChildContext, ChildProvider };
