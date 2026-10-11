import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {Sidebar2} from "./Sidebar2";
import { useCourseUI } from "../context/CourseUIContext";

const Chevron = ({ open }: { open: boolean }) => (
  <Feather
    name="chevron-down"
    size={20}
    color={open ? "#fff" : "#222"}
    style={{
      transform: [{ rotate: open ? "180deg" : "0deg" }],
    }}
  />
);

const MenuIcon = () => <Feather name="menu" size={24} color="#444" />;

const Dot = () => <View className="h-3 w-3 rounded-full border border-[#2a7ed8] bg-[#2a7ed8]" />;

export const CourseWeeks = () => {
  const { selectedCourse, setScreen } = useCourseUI();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string>("");

  const title = selectedCourse?.title || "Course";

  const sections = useMemo(() => {
    const weeks = selectedCourse?.weeks ?? {};
    const keys = Object.keys(weeks)
      .filter((k) => /^week\d+$/i.test(k))
      .sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")));
    const built = keys.map((k) => ({
      key: k,
      title: `Week ${k.replace(/\D/g, "")}`,
      items: weeks[k] ?? [],
    }));
    return built;
  }, [selectedCourse]);

  // Initialize open section to first available week
  useEffect(() => {
    if (sections.length > 0) setOpenKey(sections[0].key);
  }, [sections]);

  // Android hardware back: from Course Outline go back to My Courses
  useEffect(() => {
    const onBack = () => {
      if (drawerOpen) {
        setDrawerOpen(false);
        return true;
      }
      if (selectedCourse) {
        setScreen("preview");
      } else {
        setScreen("list");
      }
      return true; // prevent default app exit
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [drawerOpen, selectedCourse, setScreen]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* App Bar */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-neutral-200">
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <MenuIcon />
        </TouchableOpacity>
        <Text
          className="max-w-[70%] text-[18px] font-semibold text-neutral-900"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="w-6" />
      </View>

      {/* Main Section */}
      <ScrollView className="flex-1 px-4 py-4">
        {sections.map((s) => {
          const isOpen = openKey === s.key;
          return (
            <View
              key={s.key}
              className="mb-4 rounded-md border border-neutral-300 bg-white"
            >
              <TouchableOpacity
                onPress={() => setOpenKey(isOpen ? "" : s.key)}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  isOpen ? "bg-[#083c75]" : "bg-white"
                }`}
              >
                <Text
                  className={`text-[16px] ${
                    isOpen ? "text-white font-semibold" : "text-neutral-900"
                  }`}
                >
                  {s.title}
                </Text>
                <Chevron open={isOpen} />
              </TouchableOpacity>

              {isOpen && s.items && (
                <View className="border-t border-neutral-200 bg-neutral-50 px-3 py-4">
                  {s.items.map((it, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className="mb-3 flex-row items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3"
                    >
                      <Dot />
                      <Text
                        className="flex-1 text-[15px] text-neutral-700"
                        numberOfLines={1}
                      >
                        {it}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
        <View className="h-10" />
      </ScrollView>

      {/* Sidebar */}
      <Sidebar2
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active="Course Outline"
        onSelect={(key: string) => {
          if (key === "Progress") setScreen("progress");
          else if (key === "Course Outline") setScreen("weeks");
          else if (key === "My Courses") setScreen("list");
          else if (key === "Setting") setScreen("settings");
          setDrawerOpen(false);
        }}
      />
    </SafeAreaView>
  );
};