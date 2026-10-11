import "./global.css";
import React from "react";
import { View } from "react-native";
import { CourseUIProvider, useCourseUI } from "../context/CourseUIContext";
import { MyCourses } from "../components/MyCourses";
import { CourseWeeks } from "../components/CourseWeeks";
import { CoursePreview } from "../components/CoursePreview";
import { Progress } from "../components/Progress";
import { Settings } from "../components/Settings";

const AppShell: React.FC = () => {
  const { screen } = useCourseUI();
  if (screen === "preview") return <CoursePreview />;
  if (screen === "weeks") return <CourseWeeks />;
  if (screen === "progress") return <Progress />;
  if (screen === "settings") return <Settings />;
  return <MyCourses />;
};

export default function App() {
  return (
    <CourseUIProvider>
      <View className="flex-1 bg-neutral-100">
        <AppShell />
      </View>
    </CourseUIProvider>
  );
}