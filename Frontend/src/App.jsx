import React from 'react'
import { MyCourses } from './components/MyCourses.jsx'
import { CourseWeeks } from './components/CourseWeeks.jsx'
import { Progress } from './components/Progress.jsx'
import { Settings } from './components/Settings.jsx'
import { CourseUIProvider, useCourseUI } from './context/CourseUIContext.jsx'

const AppShell = () => {
  const { screen } = useCourseUI();
  if (screen === 'weeks') return <CourseWeeks />
  if (screen === 'progress') return <Progress />
  if (screen === 'settings') return <Settings />
  return <MyCourses />
}

export default function App() {
  return (
    <CourseUIProvider>
      <AppShell />
    </CourseUIProvider>
  );
}
