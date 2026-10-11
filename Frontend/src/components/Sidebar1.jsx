import React from "react";

// Simple inline icons to match the screenshot style
const Ico = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12l9-9 9 9" />
      <path d="M9 21V9h6v12" />
    </svg>
  ),
  Dashboard: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="11" width="7" height="10" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Courses: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6l9-3 9 3-9 3-9-3z" />
      <path d="M3 10l9 3 9-3" />
      <path d="M3 14l9 3 9-3" />
    </svg>
  ),
  Cert: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 12h8" />
      <path d="M8 9h8" />
    </svg>
  ),
  Catalog: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  ),
  Settings: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 9 4.6V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 21 12h.09a2 2 0 1 1 0 4H21a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  SignOut: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  ),
  Faq: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20h.01" />
      <path d="M9 9a3 3 0 116 0c0 2-3 2-3 5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
};

export const Sidebar1 = ({ open, onClose, active = "My Courses", email = "user@example.com", onSelect }) => {
  const items = [
    { key: "Home", icon: Ico.Home },
    { key: "Dashboard", icon: Ico.Dashboard },
    { key: "My Courses", icon: Ico.Courses },
    { key: "My Certifications", icon: Ico.Cert },
    { key: "Course Catalog", icon: Ico.Catalog },
    { key: "Sign Out", icon: Ico.SignOut },
    { key: "Faq", icon: Ico.Faq },
    { key: "About", icon: Ico.Info },
    { key: "Setting", icon: Ico.Settings },
  ];

  return (
    <div className={"fixed inset-0 z-50 transition-all " + (open ? "pointer-events-auto" : "pointer-events-none")}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={(open ? "opacity-50" : "opacity-0") + " absolute inset-0 bg-black transition-opacity duration-200"}
      />

      {/* Drawer */}
      <aside
        className={
          (open ? "translate-x-0" : "-translate-x-full") +
          " fixed left-0 top-0 h-full w-[78%] max-w-[340px] bg-white transition-transform duration-300 will-change-transform overflow-y-auto border-r border-neutral-200 -ml-px"
        }
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar menu"
      >
        {/* Profile card */}
        <div className="px-4 pt-6">
          <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 px-2 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-inner">
              {/* simple avatar glyph */}
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-neutral-500" fill="blue" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="3" />
                <path d="M4 20c1.5-4 14.5-4 16 0" />
              </svg>
            </div>
            <div className="text-[10px] text-neutral-800">{email}</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6 space-y-4 px-4">
          {items.map((it) => {
            const Active = it.key === active;
            const Icon = it.icon;
            return (
              <button
                key={it.key}
                className={
                  "flex w-full items-center gap-4 rounded-lg px-1 text-left text-[14px]" +
                  (Active ? " font-semibold text-sky-900" : " text-neutral-500")
                }
                onClick={() => onSelect && onSelect(it.key)}
              >
                <Icon className={(Active ? "text-sky-900" : "text-neutral-500") + " h-6 w-6"} />
                <span>{it.key}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar1;
