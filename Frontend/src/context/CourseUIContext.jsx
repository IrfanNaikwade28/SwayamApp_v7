import React, { createContext, useContext, useState } from "react";

const CourseUIContext = createContext(null);

export const CourseUIProvider = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  // screen: 'list' | 'weeks'
  const [screen, setScreen] = useState("list");

  const value = {
    selectedCourse,
    setSelectedCourse,
    screen,
    setScreen,
  };

  return (
    <CourseUIContext.Provider value={value}>{children}</CourseUIContext.Provider>
  );
};

export const useCourseUI = () => {
  const ctx = useContext(CourseUIContext);
  if (!ctx) throw new Error("useCourseUI must be used within CourseUIProvider");
  return ctx;
};
