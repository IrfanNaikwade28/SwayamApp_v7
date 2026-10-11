import React, { useMemo, useState } from "react";
import { Sidebar2 } from "./Sidebar2.jsx";
import { useCourseUI } from "../context/CourseUIContext.jsx";

const Chevron = ({ open }) => (
  <svg
    className={"h-5 w-5 transition-transform " + (open ? "rotate-180" : "rotate-0")}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MenuIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const Dot = ({ active=false }) => (
  <span className={(active ? "bg-sky-900" : "bg-neutral-300") + " inline-block h-3 w-3 rounded-full border border-neutral-300"} />
);

export const CourseWeeks = () => {
  const { selectedCourse, setScreen } = useCourseUI();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openKey, setOpenKey] = useState("week3");

  const title = selectedCourse?.title || "Course";

  const sections = useMemo(() => ([
    { key: "about", title: "About NPTEL" },
    { key: "how", title: "How does an NPTEL online course w..." },
    { key: "week0", title: "Week 0",items: [
      "Lecture 10 : Bar Diagrams",
      "Lecture 11 : Subdivided Bar Plots and Pi...",
      "Lecture 12 : 3D Pie Diagram and Histogram...",
      "Lecture 13 : Kernel Density and Stem - Le...",
      "Lecture Notes",
      "Quiz: Week 3 : Assignment 3",
      "Feedback For Week 3",
      "Week 3 : Assignment 3 Solution",
    ] },
    { key: "week1", title: "Week 1" },
    { key: "week2", title: "Week 2" },
    { key: "week3", title: "Week 3", items: [
      "Lecture 10 : Bar Diagrams",
      "Lecture 11 : Subdivided Bar Plots and Pi...",
      "Lecture 12 : 3D Pie Diagram and Histogram...",
      "Lecture 13 : Kernel Density and Stem - Le...",
      "Lecture Notes",
      "Quiz: Week 3 : Assignment 3",
      "Feedback For Week 3",
      "Week 3 : Assignment 3 Solution",
    ] },
    { key: "week4", title: "Week 4" },
    { key: "week5", title: "Week 5" },
    { key: "week6", title: "Week 6" },
    { key: "week7", title: "Week 7" },
    { key: "week8", title: "Week 8" },
  ]), []);

  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-[430px]">
        {/* App Bar */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="text-neutral-700" onClick={() => setDrawerOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="max-w-[70%] truncate text-[18px] font-semibold">{title}</h1>
            <span className="inline-block w-6" />
          </div>
        </header>

        {/* Sections */}
        <main className="space-y-4 p-4 pb-10">
          {sections.map((s) => {
            const isOpen = openKey === s.key;
            return (
              <div key={s.key} className="rounded-xl border border-neutral-300 bg-white">
                <button
                  className={
                    (isOpen ? "bg-[#083c75] text-white" : "text-neutral-900") +
                    " flex w-full items-center justify-between rounded-xl px-4 py-3 text-[16px]"
                  }
                  onClick={() => setOpenKey(isOpen ? null : s.key)}
                >
                  <span>{s.title}</span>
                  <Chevron open={isOpen} />
                </button>

                {isOpen && s.items && (
                  <div className="space-y-3 border-t border-neutral-200 bg-neutral-50 px-3 py-4">
                    {s.items.map((it, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left text-[15px] shadow-sm"
                      >
                        <Dot active={it.startsWith('Feedback')} />
                        <span className="truncate">{it}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
      <Sidebar2
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active="Course Outline"
        onSelect={(key) => {
          if (key === "Progress") {
            setScreen("progress");
          } else if (key === "Course Outline") {
            setScreen("weeks");
          } else if (key === "My Courses") {
            setScreen("list");
          } else if (key === "Setting") {
            setScreen("settings");
          }
          setDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default CourseWeeks;
