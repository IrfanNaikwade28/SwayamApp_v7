import React, { createContext, useContext, useState, PropsWithChildren, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// JS dataset with mixed shapes; we'll normalize it here
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rawData from "./assets";

export type SubjectProgress = {
  assessmentTitles: string[];
  scores: string[]; // keep as strings like source; parse where needed
  unitTitles: string[];
  unitProgress: number[]; // 0-100
  assessmentProgress: Array<number | null>; // 0-100 or null for "-"
  dateEnrolled: string;
};

export type SummaryRow = {
  label: string;
  value: string;
};

export type CourseLayoutRow = {
  week: string;
  topics: string;
};

export type CoursePreviewData = {
  videoUrl?: string;
  videoErrorCode?: string;
  videoErrorMessage?: string;
  learnersEnrolled?: string;
  examRegistrations?: string;
  instructor?: string;
  institute?: string;
  about?: string;
  intendedAudience?: string;
  prerequisites?: string;
  industrySupport?: string;
  summaryRows: SummaryRow[];
  examNote?: string;
  aicteNote?: string;
  courseLayout: CourseLayoutRow[];
  booksAndReferences: string[];
};

export type Subject = {
  id: number;
  title: string;
  start: string;
  totalWeeks: number;
  weeks: Record<string, string[]>;
  progress: SubjectProgress;
  preview: CoursePreviewData;
};

type Screen = "list" | "preview" | "weeks" | "progress" | "settings";

type Profile = {
  name: string;
  email: string;
};

type CourseUIState = {
  subjects: Subject[];
  selectedCourse: Subject | null;
  setSelectedCourse: (c: Subject | null) => void;
  screen: Screen;
  setScreen: (s: Screen) => void;
  lastScreen: Screen;
  profile: Profile;
  setProfile: (p: Profile) => void;
  addSubject: (s: Omit<Subject, "id">) => void;
  updateSubject: (id: number, patch: Partial<Omit<Subject, "id">>) => void;
  deleteSubject: (id: number) => void;
};

const CourseUIContext = createContext<CourseUIState | null>(null);

export const CourseUIProvider = ({ children }: PropsWithChildren) => {
  const [selectedCourse, setSelectedCourse] = useState<Subject | null>(null);
  const [screen, setScreenState] = useState<Screen>("list");
  const [lastScreen, setLastScreen] = useState<Screen>("list");
  const [profile, setProfile] = useState<Profile>({
    name: "Hitesh",
    email: "Hitesh@gmail.com",
  });
  const SUBJECTS_KEY = "swayam.subjects.v1";
  const PROFILE_KEY = "swayam.profile.v1";

  const pickFirst = (item: any, keys: string[]) => {
    for (const key of keys) {
      if (item?.[key] != null) return item[key];
    }
    return undefined;
  };

  const toText = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    return "";
  };

  const hashTitle = (title: string) =>
    title
      .split("")
      .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 100000, 7);

  const indianIITProfessors = [
    "Prof. Raghavendra Rao",
    "Prof. Meenakshi Iyer",
    "Prof. Anirban Chatterjee",
    "Prof. S. Narayanan",
    "Prof. Kavita Sharma",
    "Prof. A. Venkatesh",
    "Prof. P. Srinivasan",
    "Prof. Neha Kulkarni",
    "Prof. Debashis Roy",
    "Prof. Arvind Subramanian",
  ];

  const iitInstitutes = [
    "IIT Madras",
    "IIT Bombay",
    "IIT Delhi",
    "IIT Kharagpur",
    "IIT Kanpur",
    "IIT Roorkee",
    "IIT Guwahati",
    "IIT Hyderabad",
    "IIT Indore",
    "IIT BHU",
  ];

  const parseSummaryRows = (value: unknown): SummaryRow[] => {
    if (Array.isArray(value)) {
      return value
        .map((row) => {
          if (row && typeof row === "object") {
            const r = row as Record<string, unknown>;
            const label = toText(r.label ?? r.key ?? r.title ?? r.name);
            const val = toText(r.value ?? r.val ?? r.detail ?? r.text);
            if (!label || !val) return null;
            return { label, value: val };
          }
          return null;
        })
        .filter(Boolean) as SummaryRow[];
    }

    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>)
        .map(([label, val]) => {
          const parsedValue = toText(val);
          if (!parsedValue) return null;
          return { label, value: parsedValue };
        })
        .filter(Boolean) as SummaryRow[];
    }

    return [];
  };

  const parseCourseLayout = (value: unknown): CourseLayoutRow[] => {
    if (!Array.isArray(value)) return [];
    return value
      .map((row, index) => {
        if (typeof row === "string") {
          const trimmed = row.trim();
          if (!trimmed) return null;
          return { week: `Week ${index + 1}`, topics: trimmed };
        }
        if (row && typeof row === "object") {
          const r = row as Record<string, unknown>;
          const week = toText(r.week ?? r.title ?? r.name ?? `Week ${index + 1}`);
          const topics = toText(r.topics ?? r.topic ?? r.content ?? r.description ?? r.value);
          if (!week || !topics) return null;
          return { week, topics };
        }
        return null;
      })
      .filter(Boolean) as CourseLayoutRow[];
  };

  const deriveCourseLayoutFromWeeks = (weeksBlock: Record<string, string[]>) =>
    Object.keys(weeksBlock)
      .filter((k) => /^week\d+$/i.test(k))
      .sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")))
      .map((k) => ({
        week: `Week ${k.replace(/\D/g, "")}`,
        topics: (weeksBlock[k] ?? []).join(", "),
      }));

  const parseBooks = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => toText(v)).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(/\r?\n|\|/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  const buildPreview = (
    item: any,
    title: string,
    start: string,
    totalWeeks: number,
    weeksBlock: Record<string, string[]>,
    idx: number
  ): CoursePreviewData => {
    const previewObj =
      item?.preview && typeof item.preview === "object" && !Array.isArray(item.preview)
        ? item.preview
        : {};

    const pickMerged = (keys: string[]) => {
      const fromItem = pickFirst(item, keys);
      if (fromItem != null && (typeof fromItem !== "string" || fromItem.trim() !== "")) return fromItem;
      return pickFirst(previewObj, keys);
    };

    const summaryRaw = pickMerged(["summary", "courseSummary", "summaryDetails", "summaryRows"]);
    const rows = parseSummaryRows(summaryRaw);
    if (!rows.some((r) => r.label.toLowerCase() === "start date") && start) {
      rows.push({ label: "Start Date", value: start });
    }
    if (!rows.some((r) => r.label.toLowerCase() === "duration") && totalWeeks > 0) {
      rows.push({ label: "Duration", value: `${totalWeeks} weeks` });
    }

    const layoutRaw = pickMerged(["courseLayout", "layout", "syllabus"]);
    const layout = parseCourseLayout(layoutRaw);

    const booksRaw = pickMerged(["booksAndReferences", "references", "books"]);

    const isIntroML = title.trim().toLowerCase() === "introduction to machine learning";
    const seed = Math.abs(hashTitle(title) + idx * 17);
    const fallbackLearners = String(20000 + (seed % 70000));
    const fallbackExamRegistrations = String(Math.max(8000, Math.round(parseInt(fallbackLearners, 10) * 0.34)));
    const fallbackInstructor = indianIITProfessors[seed % indianIITProfessors.length];
    const fallbackInstitute = iitInstitutes[(seed + 3) % iitInstitutes.length];
    const fallbackAbout = `${title} introduces core concepts through intuitive explanations, mathematical foundations, and practical examples. The course is designed in an NPTEL format with weekly lectures, assignments, and guided problem-solving so learners can build both conceptual clarity and application skills.`;

    const videoErrorCode = toText(pickMerged(["videoErrorCode", "errorCode"]));
    const videoErrorMessage = toText(pickMerged(["videoErrorMessage", "errorMessage"]));
    const learnersEnrolled = toText(pickMerged(["learnersEnrolled", "learners", "enrolledCount"]));
    const examRegistrations = toText(
      pickMerged(["examRegistrations", "examRegistrationCount", "examEnrolled"])
    );
    const instructor = toText(pickMerged(["instructor", "faculty", "professor", "teacher"]));
    const institute = toText(pickMerged(["institute", "institution", "organization", "offeredBy"]));
    const about = toText(pickMerged(["about", "aboutCourse", "description", "overview"]));

    return {
      videoUrl:
        toText(pickMerged(["videoUrl", "videoURL", "youtubeUrl", "youtubeLink"])) ||
        (isIntroML ? "https://www.youtube.com/watch?v=4vRYkIep0m4" : "https://www.youtube.com/"),
      videoErrorCode: videoErrorCode || "Error 153",
      videoErrorMessage: videoErrorMessage || "Video player configuration error",
      learnersEnrolled: learnersEnrolled || (isIntroML ? "62102" : fallbackLearners),
      examRegistrations: examRegistrations || (isIntroML ? "19902" : fallbackExamRegistrations),
      instructor: instructor || (isIntroML ? "Prof. Balaraman Ravindran" : fallbackInstructor),
      institute: institute || (isIntroML ? "IIT Madras" : fallbackInstitute),
      about:
        about ||
        (isIntroML
          ? "With the increased availability of data from varied sources there has been increasing attention paid to the various data driven disciplines such as analytics and machine learning. In this course we intend to introduce some of the basic concepts of machine learning from a mathematically well motivated perspective. We will cover the different learning paradigms and some of the more popular algorithms used for supervised and unsupervised learning."
          : fallbackAbout),
      intendedAudience: toText(
        pickMerged(["intendedAudience", "audience", "targetAudience"])
      ),
      prerequisites: toText(
        pickMerged(["prerequisites", "preRequisites", "preReq", "eligibility"])
      ),
      industrySupport: toText(
        pickMerged(["industrySupport", "industryRelevance", "industry"])
      ),
      summaryRows: rows,
      examNote: toText(pickMerged(["examNote", "importantNote", "examDisclaimer"])),
      aicteNote: toText(pickMerged(["aicteNote", "fdpNote"])),
      courseLayout: layout.length ? layout : deriveCourseLayoutFromWeeks(weeksBlock),
      booksAndReferences: parseBooks(booksRaw),
    };
  };

  const normalizeSubject = (item: any, idx: number): Subject => {
    const weeksBlock: Record<string, string[]> =
      item && typeof item.weeks === "object" && !Array.isArray(item.weeks)
        ? item.weeks
        : {};

    const explicitWeeks = Number(item?.weeksCount ?? item?.totalWeeks);
    const totalWeeks =
      Number.isFinite(explicitWeeks) && explicitWeeks > 0
        ? explicitWeeks
        : Object.keys(weeksBlock).filter((k) => /^week\d+$/i.test(k)).length;

    const pr = item?.progress ?? {};
    const as = pr?.assessmentScore ?? item?.assessmentScore ?? {};
    const assessmentTitles: string[] = Array.isArray(as.assessmentTitle)
      ? as.assessmentTitle
      : Array.isArray(pr?.assessmentTitles)
        ? pr.assessmentTitles
        : [];
    const scoreSource = Array.isArray(as.score)
      ? as.score
      : Array.isArray(as.assessmentScore)
        ? as.assessmentScore
        : Array.isArray(pr?.scores)
          ? pr.scores
          : [];
    const scores: string[] = scoreSource.map((value: any) => String(value));

    const uw = pr?.unitWiseProgress ?? item?.unitWiseProgress ?? {};
    const unitTitles: string[] = Array.isArray(uw.unitTitle)
      ? uw.unitTitle
      : Array.isArray(pr?.unitTitles)
        ? pr.unitTitles
        : [];
    const unitProgressSource = Array.isArray(uw.unitProgress)
      ? uw.unitProgress
      : Array.isArray(pr?.unitProgress)
        ? pr.unitProgress
        : [];
    const unitProgress: number[] = unitProgressSource.map((v: any) => {
      const n = parseFloat(String(v));
      return Number.isFinite(n) ? n : 0;
    });
    const assessmentProgressSource = Array.isArray(uw.assessmentProgress)
      ? uw.assessmentProgress
      : Array.isArray(pr?.assessmentProgress)
        ? pr.assessmentProgress
        : [];
    const assessmentProgress: Array<number | null> = assessmentProgressSource.map((v: any) => {
      if (v == null || String(v).trim() === "-" || String(v).trim() === "") return null;
      const n = parseFloat(String(v));
      return Number.isFinite(n) ? n : null;
    });

    const title = String(item?.title ?? `Course ${idx + 1}`);
    const start = String(item?.start ?? "");

    return {
      id: Number.isFinite(Number(item?.id)) ? Number(item.id) : idx + 1,
      title,
      start,
      totalWeeks,
      weeks: weeksBlock,
      progress: {
        assessmentTitles,
        scores,
        unitTitles,
        unitProgress,
        assessmentProgress,
        dateEnrolled: String(pr?.Date_enrolled ?? pr?.dateEnrolled ?? item?.Date_enrolled ?? ""),
      },
      preview: buildPreview(item, title, start, totalWeeks, weeksBlock, idx),
    };
  };

  // Normalize raw data once
  const subjectsSeed: Subject[] = useMemo(() => {
    const rd: any = rawData as any;
    const arr: any[] = Array.isArray(rd) ? rd : (rd?.data ?? []);
    const norm = arr.map((item, idx): Subject => normalizeSubject(item, idx));
    return norm;
  }, []);

  const [subjects, setSubjects] = useState<Subject[]>(subjectsSeed);
  const [subjectsHydrated, setSubjectsHydrated] = useState(false);

  const fillMissingProgressFromSeed = (restored: Subject[]): Subject[] => {
    const seedByTitle = new Map(subjectsSeed.map((subject) => [subject.title.trim().toLowerCase(), subject]));

    return restored.map((subject) => {
      const fallback = seedByTitle.get(subject.title.trim().toLowerCase());
      if (!fallback) return subject;

      const hasAssessmentData =
        subject.progress.assessmentTitles.length > 0 ||
        subject.progress.scores.length > 0;
      const hasUnitData =
        subject.progress.unitTitles.length > 0 ||
        subject.progress.unitProgress.length > 0 ||
        subject.progress.assessmentProgress.length > 0;

      if (hasAssessmentData && hasUnitData) return subject;

      return {
        ...subject,
        progress: {
          ...subject.progress,
          assessmentTitles: hasAssessmentData
            ? subject.progress.assessmentTitles
            : fallback.progress.assessmentTitles,
          scores: hasAssessmentData
            ? subject.progress.scores
            : fallback.progress.scores,
          unitTitles: hasUnitData
            ? subject.progress.unitTitles
            : fallback.progress.unitTitles,
          unitProgress: hasUnitData
            ? subject.progress.unitProgress
            : fallback.progress.unitProgress,
          assessmentProgress: hasUnitData
            ? subject.progress.assessmentProgress
            : fallback.progress.assessmentProgress,
          dateEnrolled: subject.progress.dateEnrolled || fallback.progress.dateEnrolled,
        },
      };
    });
  };

  const persistSubjectsNow = (next: Subject[]) => {
    AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(next)).catch(() => {
      // ignore write errors
    });
  };

  // Single constant weeks template used across ALL courses (immutable source of truth for CourseWeeks page)
  const weeksTemplate: Record<string, string[]> = useMemo(() => {
    const first = subjectsSeed[0]?.weeks ?? {};
    return first;
  }, [subjectsSeed]);

  // Load persisted subjects (if any) once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SUBJECTS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const restored = parsed.map((item, idx) => normalizeSubject(item, idx));
            const migrated = fillMissingProgressFromSeed(restored);
            setSubjects(migrated);
            persistSubjectsNow(migrated);
            return;
          }
        }

        setSubjects(subjectsSeed);
      } catch {
        // ignore
      } finally {
        setSubjectsHydrated(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist subjects when they change
  useEffect(() => {
    if (!subjectsHydrated) return;
    (async () => {
      try {
        await AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
      } catch {
        // ignore
      }
    })();
  }, [subjects, subjectsHydrated]);

  const [profileHydrated, setProfileHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Profile>;
          if (parsed && typeof parsed === "object") {
            setProfile((prev) => ({
              name: parsed.name ?? prev.name,
              email: parsed.email ?? prev.email,
            }));
          }
        }
      } catch {
        // ignore corrupt storage
      } finally {
        setProfileHydrated(true);
      }
    })();
    // no deps: run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!profileHydrated) return;
    (async () => {
      try {
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      } catch {
        // ignore write errors
      }
    })();
  }, [profile, profileHydrated]);

  const value: CourseUIState = {
    subjects,
    selectedCourse,
    setSelectedCourse,
    screen,
    setScreen: (s: Screen) => {
      setScreenState((current) => {
        setLastScreen(current);
        return s;
      });
    },
    lastScreen,
    profile,
    setProfile,
    addSubject: (s) => {
      setSubjects((prev) => {
        const nextId = (prev.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1;
        // Always inject constant weeks template; ignore incoming weeks
        const { weeks: _ignoredWeeks, ...rest } = s as any;
        const subject: Subject = { id: nextId, ...rest, weeks: weeksTemplate } as Subject;
        const next = [...prev, subject];
        persistSubjectsNow(next);
        return next;
      });
    },
    updateSubject: (id, patchRaw) => {
      // Weeks are constant and must not be changed via settings
      const { weeks: _ignoredWeeks, ...patch } = patchRaw as any;
      setSubjects((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...patch,
                weeks: c.weeks, // keep existing weeks untouched
                progress: patch.progress ? { ...c.progress, ...patch.progress } : c.progress,
              }
            : c
        );
        persistSubjectsNow(next);
        return next;
      });
      if (selectedCourse && selectedCourse.id === id) {
        setSelectedCourse({
          ...selectedCourse,
          ...patch,
          weeks: selectedCourse.weeks,
          progress: patch.progress ? { ...selectedCourse.progress, ...patch.progress } : selectedCourse.progress,
        });
      }
    },
    deleteSubject: (id) => {
      setSubjects((prev) => {
        const next = prev.filter((c) => c.id !== id);
        persistSubjectsNow(next);
        return next;
      });
      if (selectedCourse && selectedCourse.id === id) {
        setSelectedCourse(null);
        setScreenState("list");
      }
    },
  };

  return <CourseUIContext.Provider value={value}>{children}</CourseUIContext.Provider>;
};

export const useCourseUI = () => {
  const ctx = useContext(CourseUIContext);
  if (!ctx) throw new Error("useCourseUI must be used within CourseUIProvider");
  return ctx;
};
