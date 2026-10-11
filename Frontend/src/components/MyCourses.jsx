import React, { useMemo, useState } from "react";
import { Sidebar1 } from "./Sidebar1.jsx";
import { useCourseUI } from "../context/CourseUIContext.jsx";
import NptelLogo from "../assets/NPTEL_logo.png";

// Small inline SVG icons to avoid adding extra dependencies
const Icon = {
  Menu: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Filter: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
    </svg>
  ),
  Search: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Calendar: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const coursesSeed = [
  {
    id: 1,
    title: "Descriptive Statistics with R Software",
    weeks: 8,
    start: "Mon Aug 18 2025",
  },
  {
    id: 2,
    title: "Advanced R Programming for Data Analytics in Business",
    weeks: 12,
    start: "Mon Jul 21 2025",
  },
  {
    id: 3,
    title: "Data Analysis & Decision Making - II",
    weeks: 12,
    start: "Mon Jul 21 2025",
  },
  {
    id: 4,
    title: "Developing Soft Skills and Personality",
    weeks: 8,
    start: "Mon Aug 18 2025",
  },
  {
    id: 5,
    title: "Data Structure and Algorithms using Java",
    weeks: 12,
    start: "Mon Jul 21 2025",
  },
  { id: 6, title: "Big Data Computing", weeks: 8, start: "Mon Aug 18 2025" },
  { id: 7, title: "Programming In Java", weeks: 12, start: "Mon Jul 21 2025" },
];

export const MyCourses = () => {
  const { setSelectedCourse, setScreen } = useCourseUI();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Prevent background scroll when drawer is open
  React.useEffect(() => {
    const original = document.body.style.overflow;
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [drawerOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coursesSeed;
    return coursesSeed.filter((c) => c.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <div className="min-h-dvh bg-neutral-100 text-neutral-900">
        {/* Mobile container */}
        <div className="mx-auto max-w-[430px] bg-white/0">
          {/* Top App Bar */}
          <header className="sticky top-0 z-10 shadow-sm bg-neutral-100">
            <div className="flex items-center justify-between px-4 py-4 bg-white">
              <button aria-label="Menu" className="text-neutral-700" onClick={() => setDrawerOpen(true)}>
                <Icon.Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold">My Courses</h1>
              <button aria-label="Filter" className="text-neutral-700">
                <Icon.Filter className="h-6 w-6" />
              </button>
            </div>
            {/* Tabs */}
            <div className="bg-white">
              <div className="mt-1">
                <div className="flex w-full items-center justify-center">
                  {[
                    { key: "upcoming", label: "Upcoming/Ongoing" },
                    { key: "completed", label: "Completed" },
                  ].map((t) => {
                    const active = activeTab === t.key;
                    return (
                      <button
                        key={t.key}
                        className={
                          "relative pb-3 text-sm text-center pt-2 w-1/2" +
                          (active
                            ? " font-semibold text-sky-900"
                            : " text-neutral-500")
                        }
                        onClick={() => setActiveTab(t.key)}
                      >
                        {t.label}
                        {active && (
                          <span className="absolute -bottom-0 left-0 right-0 h-[2px] w-full bg-sky-900" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>
          {/* Search */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 shadow-sm">
              <Icon.Search className="h-5 w-5 text-neutral-500" />
              <input
                className="w-full border-0 bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          {/* List */}
          <main className="space-y-3 p-4 pb-8">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm cursor-pointer active:bg-neutral-50"
                onClick={() => { setSelectedCourse(c); setScreen('weeks'); }}
              >
                {/* Left logo + org */}
                <div className="flex w-16 shrink-0 flex-col items-center justify-start">
                  <img
                    src={NptelLogo}
                    alt="NPTEL"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span className="mt-1 text-[11px] font-medium text-neutral-600">
                    NPTEL
                  </span>
                </div>
                {/* Right content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-semibold leading-snug text-neutral-900">
                    {c.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-neutral-600">
                    <Icon.Calendar className="h-4 w-4" />
                    <span>
                      {c.weeks} Weeks (Starts: {c.start})
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-neutral-500">
                No courses found
              </p>
            )}
          </main>
          {/* Sidebar Drawer */}
          <Sidebar1 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            active="My Courses" 
            email="irfannayakvade2230@gmail.com"
            onSelect={(key) => {
              if (key === "My Courses") {
                setScreen('list');
              } else if (key === "Setting") {
                setScreen('settings');
              }
              setDrawerOpen(false);
            }}
          />
        </div>
      </div>
    </>
  );
};
