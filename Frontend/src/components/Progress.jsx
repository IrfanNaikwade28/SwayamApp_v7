import React, { useMemo, useState } from "react";
import { Sidebar2 } from "./Sidebar2.jsx";
import { useCourseUI } from "../context/CourseUIContext.jsx";

const MenuIcon = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const Plus = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Minus = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Donut = ({ value = 1.22 }) => {
  const radius = 70; // px
  const stroke = 25;
  const c = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-52 w-52">
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#0b3a74"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="butt"
        transform="rotate(-90 100 100)"
      />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-neutral-700 text-[12px] font-semibold"
      >
        {value.toFixed(2)}%
      </text>
    </svg>
  );
};

export const Progress = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setScreen } = useCourseUI();
  const [open, setOpen] = useState({
    assessment: true,
    unitwise: false,
    grading: false,
  });

  const unitRows = useMemo(
    () => [
      { title: "How does an NPTEL online c...", lesson: "0%", assess: "--" },
      { title: "Week 0", lesson: "0%", assess: "--" },
      { title: "Week 1", lesson: "0%", assess: "0%" },
      { title: "Week 2", lesson: "0%", assess: "0%" },
      { title: "Week 3", lesson: "14.29%", assess: "0%" },
      { title: "Week 4", lesson: "0%", assess: "0%" },
      { title: "Week 5", lesson: "0%", assess: "0%" },
      { title: "Week 6", lesson: "0%", assess: "0%" },
      { title: "Week 7", lesson: "0%", assess: "0%" },
      { title: "Week 8", lesson: "0%", assess: "0%" },
      { title: "About NPTEL...", lesson: "0%", assess: "--" },
    ],
    []
  );

  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-[430px]">
        {/* App Bar */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-neutral-700"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-[18px] font-semibold">Progress</h1>
            <span className="inline-block w-6" />
          </div>
        </header>

        <main className="space-y-4 p-4 pb-10">
          {/* Profile */}
          <section className="rounded-xl border border-neutral-300 bg-white">
            <div className="px-8 py-8">
              <table className="w-full table-fixed">
                <tbody>
                  <tr>
                    <td className="w-1/3 pr-3 align-middle text-[12px] font-medium text-neutral-600">Name</td>
                    <td className="w-2/3 pl-6 align-middle text-left text-[12px] font-medium text-neutral-900">Irfan Naikwade</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 pr-3 align-middle text-[12px] font-medium text-neutral-600">Email</td>
                    <td className="w-2/3 pl-6 align-middle whitespace-normal wrap-break-word text-left text-[12px] font-medium text-neutral-900">irfannayakvade2230@gmail.com</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 pr-3 align-middle text-[12px] font-medium text-neutral-600">Date Enrolled</td>
                    <td className="w-2/3 pl-6 align-middle text-left text-[12px] font-medium text-neutral-900">2025-07-22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* Course Progress */}
          <section className="rounded-xl border border-neutral-300 bg-white p-4">
            <h2 className="mb-2 text-[18px] font-semibold">Course Progress</h2>
            <Donut value={1.22} />
          </section>
          {/* Assessment Scores */}
          <section className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
            <button
              className={
                "flex w-full items-center justify-between px-4 py-3 " +
                (open.assessment
                  ? "bg-[#083c75] text-white"
                  : "bg-white text-neutral-800")
              }
              onClick={() =>
                setOpen((s) => ({ ...s, assessment: !s.assessment }))
              }
            >
              <h3 className="text-[16px] font-medium">
                Your Assessment scores
              </h3>
              {open.assessment ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>

            {open.assessment && (
              <div className="p-4">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_120px] items-center gap-x-4 border-b border-neutral-200 pb-3 text-[13px] font-medium text-neutral-600">
                  <div>Assessment Title</div>
                  <div className="text-center">Assessment Score</div>
                </div>
                {/* Rows with alternating background matching screenshot */}
                {[90, 100, 70, 100, "--", "--", "--", "--"].map((score, i) => (
                  <div
                    key={i}
                    className={
                      (i % 2 === 0 ? "bg-neutral-200" : "bg-white") +
                      " mt-3 rounded-md border border-neutral-200"
                    }
                  >
                    <div className="grid grid-cols-[1fr_120px] items-center gap-x-4 p-3 text-[15px]">
                      <div>{`Week ${i + 1} : Assignment ${i + 1}`}</div>
                      <div className="text-center text-neutral-700">
                        {score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Unitwise Progress */}
          <section className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
            <button
              className={
                "flex w-full items-center justify-between px-4 py-3 " +
                (open.unitwise
                  ? "bg-[#083c75] text-white"
                  : "bg-white text-neutral-800")
              }
              onClick={() => setOpen((s) => ({ ...s, unitwise: !s.unitwise }))}
            >
              <h3 className="text-[16px] font-medium">Unitwise Progress</h3>
              {open.unitwise ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
            {open.unitwise && (
              <div className="p-4">
                <div className="grid grid-cols-[1fr_100px_130px] items-center gap-x-3 border-b border-neutral-200 pb-3 text-[13px] font-medium text-neutral-600">
                  <div>Unit Title</div>
                  <div className="text-center">
                    Lesson <br /> Progress
                  </div>
                  <div className="text-center">
                    Assessment <br /> Progress
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  {unitRows.map((r, i) => (
                    <div
                      key={r.title + i}
                      className={
                        (i % 2 === 0 ? "bg-neutral-200" : "bg-white") +
                        " rounded-md border border-neutral-200"
                      }
                    >
                      <div className="grid grid-cols-[1fr_100px_130px] items-center gap-x-3 p-3 text-[11px]">
                        <div className="truncate">{r.title}</div>
                        <div className="text-center text-neutral-700">
                          {r.lesson}
                        </div>
                        <div className="text-center text-neutral-600">
                          {r.assess}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          {/* Grading Policy */}
          <section className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
            <button
              className={
                "flex w-full items-center justify-between px-4 py-3 " +
                (open.grading
                  ? "bg-[#083c75] text-white"
                  : "bg-white text-neutral-800")
              }
              onClick={() => setOpen((s) => ({ ...s, grading: !s.grading }))}
            >
              <h3 className="text-[16px] font-medium">Grading Policy</h3>
              {open.grading ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
            {open.grading && (
              <div className="p-4 text-[14px] leading-6 text-neutral-800">
                <p className="mb-3">
                  The course is free to enroll and learn from. But if you want a
                  certificate, you have to register and write the proctored exam
                  conducted by us in person at any of the designated exam
                  centres.
                </p>
                <p className="mb-3">
                  The exam is optional for a fee of Rs 1000/- (Rupees one
                  thousand only).
                </p>
                <p className="mb-2 font-semibold">
                  Date and Time of Exam: November 01, 2025
                </p>
                <p className="mb-3">
                  9:00 am to 12 noon. Afternoon Session 2:00 pm to 5:00 pm. The
                  exact session/slot will be announced later.
                </p>
                <p className="mb-2 font-semibold">Registration form link</p>
                <p className="mb-3">
                  The registration link for the exam will be published when the
                  form is made available. The link will also be visible in your
                  course page.
                </p>
                <p className="mb-2 font-semibold">
                  CRITERIA TO GET A CERTIFICATE
                </p>
                <ul className="mb-3 list-disc pl-5">
                  <li>
                    Average assignment score = 25% of average of best 6
                    assignments out of the total 8 assignments given in the
                    course.
                  </li>
                  <li>
                    Exam score = 75% of the proctored certification exam score
                    out of 100.
                  </li>
                  <li>Final score = Average assignment score + Exam score.</li>
                </ul>
                <p className="mb-3">
                  You will be eligible for a certificate only if average
                  assignment score is &gt;=10/25 and exam score is &gt;=30/75.
                  If one of the two criteria is not met, you will not get the
                  certificate even if the final score is &gt;=40/100.
                </p>
                <p className="mb-3">
                  Certificate will have your name, photograph and the score in
                  the final exam with the breakup. It will have the logos of
                  NPTEL and IIT Kanpur. It will be e-verifiable at{" "}
                  <span className="underline">nptel.ac.in/noc</span>.
                </p>
                <p className="mb-3">
                  Only the e-certificate will be made available. Hard copies
                  will not be dispatched.
                </p>
                <p className="mb-3">
                  Once again, thanks for your interest in our online courses and
                  certification. Happy learning.
                </p>
                <p className="mb-3">- NPTEL Team</p>
              </div>
            )}
          </section>
          {/* Info box */}{" "}
          <section className="rounded-xl border border-neutral-300 bg-white p-4">
            {" "}
            <div className="grid grid-cols-[190px_1fr] gap-y-6 text-[14px]">
              {" "}
              <div className="font-medium">
                Subscribe/Unsubscribe( Announcement)
              </div>{" "}
              <div>
                {" "}
                You are currently receiving course-related emails.{" "}
                <a className="text-sky-800 underline">
                  Click here to unsubscribe.
                </a>{" "}
              </div>{" "}
              <div className="font-medium">Unsubscribe from Forum</div>{" "}
              <div>
                {" "}
                If you want to unsubscribe from discussion forum,{" "}
                <a className="text-sky-800 underline">Click here</a>.{" "}
              </div>{" "}
            </div>{" "}
          </section>
        </main>
      </div>

      <Sidebar2
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active="Progress"
        onSelect={(key) => {
          if (key === "Course Outline") {
            setScreen("weeks");
          } else if (key === "My Courses") {
            setScreen("list");
          } else if (key === "Progress") {
            setScreen("progress");
          } else if (key === "Setting") {
            setScreen("settings");
          }
          setDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default Progress;
