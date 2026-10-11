import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourseUI } from "../context/CourseUIContext";
import { Sidebar1 } from "../components/Sidebar1";
import NptelLogo from "../assets/images/NPTEL_logo.png";
import { Feather } from "@expo/vector-icons";

export const MyCourses: React.FC = () => {
  const { subjects, setSelectedCourse, setScreen } = useCourseUI();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((course) =>
      course.title.toLowerCase().includes(q)
    );
  }, [query, subjects]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-neutral-200">
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Feather name="menu" color="#444" size={26} />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-neutral-900">
          My Courses
        </Text>
        <TouchableOpacity>
          <Feather name="filter" color="#444" size={22} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white mt-1">
        {[
          { key: "upcoming", label: "Upcoming/Ongoing" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 pt-2 pb-3"
            onPress={() =>
              setActiveTab(tab.key as "upcoming" | "completed")
            }
          >
            <View className="items-center">
              <Text
                className={`text-[14px] ${
                  activeTab === tab.key
                    ? "text-sky-900 font-semibold"
                    : "text-neutral-500"
                }`}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View className="absolute -bottom-3 left-0 right-0 h-[2px] w-full bg-sky-900" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center gap-2 rounded-xl bg-white border border-neutral-300 px-3 py-2">
          <Feather name="search" color="#666" size={18} />
          <TextInput
            className="flex-1 text-[15px] text-neutral-800"
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Course List */}
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 pb-8">
        {filteredCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() => {
              setSelectedCourse(course);
              setScreen("preview");
            }}
            className="flex-row gap-3 items-start bg-white border border-neutral-200 rounded-md p-4 mb-3"
          >
            {/* Left Logo */}
            <View className="w-16 items-center">
              <Image
                source={NptelLogo}
                className="h-12 w-12 rounded-full"
                resizeMode="cover"
              />
              <Text className="text-[11px] text-neutral-600 mt-1 font-medium">
                NPTEL
              </Text>
            </View>

            {/* Course Info */}
            <View className="flex-1">
              <Text className="text-[18px] font-semibold text-neutral-900 leading-snug">
                {course.title}
              </Text>
              <View className="flex-row items-center mt-3 gap-2">
                <Feather name="calendar" color="#555" size={14} />
                <Text className="text-[13px] text-neutral-600">
                  {course.totalWeeks} Weeks (Starts: {course.start})
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredCourses.length === 0 && (
          <Text className="text-center text-sm text-neutral-500 py-12">
            No courses found
          </Text>
        )}
      </ScrollView>

      {/* Sidebar Drawer */}
      {drawerOpen && (
        <Sidebar1
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="My Courses"
          onSelect={(key: string) => {
            if (key === "My Courses") setScreen("list");
            else if (key === "Setting") setScreen("settings");
            setDrawerOpen(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};
