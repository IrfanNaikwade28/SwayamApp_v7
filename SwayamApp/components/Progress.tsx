import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Linking,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Sidebar2 } from "./Sidebar2";
import { useCourseUI } from "../context/CourseUIContext";

type SectionState = {
  assessment: boolean;
  unitwise: boolean;
  grading: boolean;
};

const MenuIcon = ({ size = 26, color = "#1f2328" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.2}>
    <Line x1="3" y1="6" x2="21" y2="6" />
    <Line x1="3" y1="12" x2="21" y2="12" />
    <Line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);

const Plus = ({ size = 22, color = "#202124" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.1}>
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const Minus = ({ size = 22, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.1}>
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const Donut = ({ value = 0 }) => {
  const radius = 62;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  return (
    <View className="items-center justify-center pt-0 pb-0">
      <Svg width={270} height={270} viewBox="0 0 220 220">
        <Circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#e5e5e7"
          strokeWidth={stroke}
          fill="none"
        />
        {clamped > 0 ? (
          <Circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#21a33e"
            strokeWidth={stroke}
            strokeDasharray={`${dash}, ${circumference - dash}`}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 110 110)"
          />
        ) : null}
      </Svg>

      <View style={styles.donutLabelWrap}>
        <Text style={styles.donutValue}>{clamped.toFixed(1)}</Text>
        <Text style={styles.donutPercent}>%</Text>
      </View>
    </View>
  );
};

export const Progress = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setScreen, selectedCourse, profile } = useCourseUI();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<SectionState>({
    assessment: false,
    unitwise: false,
    grading: false,
  });

  const { donutValue, assessmentPairs, unitRows } = useMemo(() => {
    const pr = selectedCourse?.progress;
    if (!pr) {
      return {
        donutValue: 0,
        assessmentPairs: [] as { title: string; score: string }[],
        unitRows: [] as { title: string; lesson: string; assess: string }[],
      };
    }

    const rows = (pr.unitTitles || []).map((title, index) => {
      const lessonVal = Number(pr.unitProgress?.[index] ?? 0);
      const assessRaw = pr.assessmentProgress?.[index];
      const assessVal = assessRaw == null ? null : Number(assessRaw);
      return {
        title,
        lesson: `${Number.isFinite(lessonVal) ? Math.floor(lessonVal) : 0} %`,
        assess:
          assessVal == null || !Number.isFinite(assessVal)
            ? "--"
            : `${Math.floor(assessVal)} %`,
      };
    });

    const scores = pr.scores || [];
    const titles = pr.assessmentTitles || [];
    const pairs = titles.map((title, index) => {
      const score = scores[index];
      if (score == null) return { title, score: "--" };
      const numberScore = parseFloat(String(score));
      return {
        title,
        score: Number.isFinite(numberScore) ? String(Math.floor(numberScore)) : String(score),
      };
    });

    const values = (pr.unitProgress || []).filter((n) => typeof n === "number");
    const progressVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return { donutValue: progressVal, assessmentPairs: pairs, unitRows: rows };
  }, [selectedCourse]);

  useEffect(() => {
    const onBack = () => {
      if (drawerOpen) {
        setDrawerOpen(false);
        return true;
      }
      if (selectedCourse) {
        setScreen("weeks");
      } else {
        setScreen("list");
      }
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [drawerOpen, selectedCourse, setScreen]);

  return (
    <SafeAreaView className="flex-1 bg-[#ececf4]">
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-row items-center justify-between bg-[#ffffff] px-4 py-3 border-b border-[#e2e2ea]">
          <TouchableOpacity onPress={() => setDrawerOpen(true)} className="w-8">
            <MenuIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Progress</Text>
          <View className="w-8" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 92, 120) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mt-3">
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profileDate}>
              Date Enrolled: {selectedCourse?.progress?.dateEnrolled || "--"}
            </Text>
          </View>

          <View style={{height:280}} className="mt-5 flex gap-0 border border-[#c1c4cd] rounded-[16px] bg-[#f5f5f6] px-2 pt-5">
            <Text style={styles.courseProgressTitle}>Course Progress</Text>
            <Donut value={donutValue} />
          </View>

          <Accordion
            title="Your Assessment scores"
            open={open.assessment}
            onToggle={() => setOpen((prev) => ({ ...prev, assessment: !prev.assessment }))}
          >
            <View className="flex-row justify-between px-3 pb-3 border-b border-[#e1e3e9]">
              <Text style={styles.tableHeader}>Assessment Title</Text>
              <Text style={styles.tableHeader}>Assessment Score</Text>
            </View>

            {assessmentPairs.map((row, index) => (
              <View
                key={`${row.title}-${index}`}
                className={`mt-4 px-3 py-5 ${index % 2 === 0 ? "bg-[#d3d3d5]" : "bg-[#f7f7f8]"}`}
              >
                <View className="flex-row justify-between items-center">
                  <Text style={styles.assessmentTitle}>{row.title}</Text>
                  <Text style={styles.assessmentScore}>{row.score}</Text>
                </View>
              </View>
            ))}
          </Accordion>

          <Accordion
            title="Unit Wise Progress"
            open={open.unitwise}
            onToggle={() => setOpen((prev) => ({ ...prev, unitwise: !prev.unitwise }))}
          >
            <View className="flex-row justify-between px-3 pb-3 border-b border-[#e1e3e9]">
              <Text style={styles.unitHeaderTitle} allowFontScaling={false}>Unit Title</Text>
              <Text style={styles.unitHeaderMeta} allowFontScaling={false}>Lesson{"\n"}Progress</Text>
              <Text style={styles.unitHeaderMeta} allowFontScaling={false}>Assessment{"\n"}Progress</Text>
            </View>

            {unitRows.map((row, index) => (
              <View
                key={`${row.title}-${index}`}
                className={`mt-4 px-4 py-5 ${index % 2 === 0 ? "bg-[#d3d3d5]" : "bg-[#f7f7f8]"}`}
              >
                <View className="flex-row items-center justify-between">
                  <Text style={styles.unitRowTitle} numberOfLines={2} allowFontScaling={false}>
                    {row.title}
                  </Text>
                  <Text style={styles.unitRowMeta} allowFontScaling={false}>{row.lesson}</Text>
                  <Text style={styles.unitRowMeta} allowFontScaling={false}>{row.assess}</Text>
                </View>
              </View>
            ))}
          </Accordion>

          <Accordion
            title="Grading Policy"
            open={open.grading}
            onToggle={() => setOpen((prev) => ({ ...prev, grading: !prev.grading }))}
          >
            <Text className="text-[14px] leading-6 text-[#21242a]">
              The course is free to enroll and learn from. But if you want a certificate, you have to
              register and write the proctored exam conducted by us in person at any of the designated exam centres.
            </Text>
            <Text className="mt-2 text-[14px] leading-6 text-[#21242a]">
              The exam is optional for a fee of Rs 1000/- (Rupees one thousand only).
            </Text>
            <Text className="mt-2 text-[14px] leading-6 text-[#21242a]">
              Date and Time of Exam: April 17, 2026 Morning Session 9:00 am to 12 noon, Afternoon Session 2:00 pm to 5:00 pm.
            </Text>
            <Text className="mt-2 text-[14px] leading-6 text-[#21242a]">
              CRITERIA TO GET A CERTIFICATE: Average assignment score = 25% and exam score = 75%.
            </Text>
            <Text className="mt-2 text-[14px] leading-6 text-[#21242a]">
              YOU WILL BE ELIGIBLE FOR A CERTIFICATE ONLY IF AVERAGE ASSIGNMENT SCORE ≥ 10/25 AND EXAM SCORE ≥ 30/75.
            </Text>
            <Text className="mt-2 text-[14px] leading-6 text-[#21242a]">- NPTEL Team</Text>
          </Accordion>

          <InfoCard
            title="Subscribe/Unsubscribe(Announcement)"
            text="You are currently receiving course-related emails."
            linkText="Click here to unsubscribe."
            onPress={() => Linking.openURL("https://nptel.ac.in/unsubscribe")}
          />

          <InfoCard
            title="Unsubscribe from Forum"
            text="If you want to unsubscribe from discussion forum,"
            linkText="Click here."
            onPress={() => Linking.openURL("https://nptel.ac.in/forum-unsubscribe")}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute right-5 h-[58px] w-[58px] rounded-full border border-[#d8d9e1] bg-white items-center justify-center"
        style={[
          styles.chatFab,
          {
            bottom: Math.max(insets.bottom + 18, 34),
          },
        ]}
      >
        <Image
          source={require("../assets/images/ai-icon.png")}
          style={styles.chatFabImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Sidebar2
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active="Progress"
        onSelect={(key: string) => {
          setScreen(
            key === "Course Outline"
              ? "weeks"
              : key === "My Courses"
                ? "list"
                : key === "Setting"
                  ? "settings"
                  : "progress"
          );
          setDrawerOpen(false);
        }}
      />
    </SafeAreaView>
  );
};

const Accordion = ({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <View className="mt-4 overflow-hidden rounded-[5px] border border-[#bcc0c9] bg-[#f7f7f8]">
    <TouchableOpacity
      onPress={onToggle}
      className={`flex-row items-center justify-between px-5 py-4 ${open ? "bg-[#2c7ed8]" : "bg-[#f8f8fa]"}`}
    >
      <Text allowFontScaling={false} style={[styles.accordionTitle, open ? styles.accordionOpenText : styles.accordionClosedText]}>{title}</Text>
      {open ? <Minus /> : <Plus />}
    </TouchableOpacity>

    {open ? <View className="border-t border-[#d1d3db] px-4 pt-6 pb-4 bg-[#f7f7f8]">{children}</View> : null}
  </View>
);

const InfoCard = ({
  title,
  text,
  linkText,
  onPress,
}: {
  title: string;
  text: string;
  linkText: string;
  onPress: () => void;
}) => (
  <View className="mt-4 rounded-[10px] border border-[#bfc3cc] bg-[#f7f7f8] px-4 py-3.5">
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoText}>{text}</Text>
    <Text style={styles.infoLink} onPress={onPress}>
      {linkText}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#15171c",
  },
  profileName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2a79d1",
    textAlign: "center",
    lineHeight: 40,
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "400",
    color: "#5f6369",
    textAlign: "center",
  },
  profileDate: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "400",
    color: "#1a1d23",
    textAlign: "center",
  },
  courseProgressTitle: {
    textAlign: "center",
    color: "#17191e",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  donutLabelWrap: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  donutValue: {
    fontSize: 40,
    lineHeight: 38,
    fontWeight: "600",
    color: "#101217",
  },
  donutPercent: {
    position:"absolute",
    bottom: -6,
    right: -16,
    fontSize: 20,
    lineHeight: 18,
    fontWeight: "500",
    color: "#101217",
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  accordionOpenText: {
    color: "#ffffff",
  },
  accordionClosedText: {
    color: "#202227",
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: "400",
    color: "#2a2d32",
  },
  assessmentTitle: {
    width: "68%",
    fontSize: 15,
    fontWeight: "400",
    color: "#1f2227",
  },
  assessmentScore: {
    width: "28%",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "400",
    color: "#2d2f35",
  },
  unitHeaderTitle: {
    width: "48%",
    fontSize: 12,
    fontWeight: "400",
    color: "#2a2d32",
  },
  unitHeaderMeta: {
    width: "20%",
    textAlign: "center",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "400",
    color: "#2a2d32",
  },
  unitRowTitle: {
    width: "48%",
    fontSize: 14,
    fontWeight: "400",
    color: "#1f2227",
  },
  unitRowMeta: {
    width: "26%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400",
    color: "#2a2d32",
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#191c22",
  },
  infoText: {
    marginTop: 2,
    fontSize: 13,
    color: "#2f3238",
  },
  infoLink: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#2a79d1",
  },
  chatFab: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chatFabImage: {
    width: 60,
    height: 60,
  },
});
