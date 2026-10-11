import React from "react";
import { View, Text, TouchableOpacity, Pressable, Animated } from "react-native";
import Svg, { Rect, Path, Circle } from "react-native-svg";
import { useCourseUI } from "../context/CourseUIContext";

type IconProps = {
  color?: string;
  size?: number;
};

const I = {
  Dashboard: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Rect x="3" y="3" width="7" height="9" />
      <Rect x="14" y="3" width="7" height="5" />
      <Rect x="14" y="11" width="7" height="10" />
      <Rect x="3" y="14" width="7" height="7" />
    </Svg>
  ),
  Profile: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Circle cx="12" cy="8" r="3" />
      <Path d="M4 20c1.5-4 14.5-4 16 0" />
    </Svg>
  ),
  Progress: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M3 12h6v8H3zM11 6h6v14h-6zM19 2h2v18h-2z" />
    </Svg>
  ),
  Mentor: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Circle cx="8" cy="8" r="3" />
      <Circle cx="16" cy="8" r="3" />
      <Path d="M2 20c2-4 12-4 14 0" />
      <Path d="M8 20c2-4 12-4 14 0" />
    </Svg>
  ),
  Outline: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Rect x="3" y="4" width="18" height="14" rx="2" />
      <Path d="M7 8h10M7 12h6" />
    </Svg>
  ),
  QA: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M21 15a4 4 0 01-4 4H7l-4 4V5a4 4 0 014-4h10a4 4 0 014 4z" />
    </Svg>
  ),
  Ann: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M3 11l18-7v16l-18-7z" />
    </Svg>
  ),
  Recommend: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M14 9V5l-7 7 7 7v-4h7V9z" />
    </Svg>
  ),
  Courses: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M3 6l9-3 9 3-9 3-9-3z" />
      <Path d="M3 10l9 3 9-3" />
      <Path d="M3 14l9 3 9-3" />
    </Svg>
  ),
  Cert: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Rect x="3" y="4" width="18" height="14" rx="2" />
      <Path d="M8 12h8" />
    </Svg>
  ),
  Catalog: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Circle cx="6" cy="6" r="2" />
      <Circle cx="18" cy="6" r="2" />
      <Circle cx="6" cy="18" r="2" />
      <Circle cx="18" cy="18" r="2" />
    </Svg>
  ),
  SignOut: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M10 17l5-5-5-5" />
      <Path d="M15 12H3" />
      <Path d="M21 3v18" />
    </Svg>
  ),
  Info: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  ),
  Settings: ({ color = "#000", size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
      <Path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
      <Path d="M2 12h3" />
      <Path d="M19 12h3" />
      <Path d="M12 2v3" />
      <Path d="M12 19v3" />
      <Path d="M4.93 4.93l2.12 2.12" />
      <Path d="M16.95 16.95l2.12 2.12" />
      <Path d="M19.07 4.93l-2.12 2.12" />
      <Path d="M7.05 16.95l-2.12 2.12" />
    </Svg>
  ),
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  active?: string;
  email?: string;
  onSelect?: (key: string) => void;
}

export const Sidebar2: React.FC<SidebarProps> = ({
  open,
  onClose,
  active = "Course Outline",
  email = "",
  onSelect,
}) => {
  const { profile } = useCourseUI();
  const resolvedEmail = email || profile.email;
  const items = [
    { key: "Dashboard", icon: I.Dashboard },
    { key: "My Profile", icon: I.Profile },
    { key: "Progress", icon: I.Progress },
    { key: "Mentor", icon: I.Mentor },
    { key: "Course Outline", icon: I.Outline },
    { key: "Q&A", icon: I.QA },
    { key: "Announcements", icon: I.Ann },
    { key: "Course Recommendations", icon: I.Recommend },
    { key: "My Courses", icon: I.Courses },
    { key: "My Certifications", icon: I.Cert },
    { key: "Course Catalog", icon: I.Catalog },
    { key: "Sign Out", icon: I.SignOut },
    { key: "About", icon: I.Info },
    { key: "Setting", icon: I.Settings },
  ];

  return (
    <View className={`absolute inset-0 z-50 ${open ? "" : "hidden"}`}>
      {/* Backdrop */}
      <Pressable onPress={onClose} className="absolute inset-0 bg-black/40" />

      {/* Drawer */}
      <Animated.View className="absolute left-0 top-0 h-full w-[78%] max-w-[340px] bg-white p-4 border-r border-neutral-200">
        {/* Profile Card */}
        <View className="flex-row items-center gap-3 border border-neutral-200 bg-neutral-50 p-4 mt-3">
          <View className="h-12 w-12 rounded-full bg-white items-center justify-center">
            <I.Profile color="#6b7280" size={28} />
          </View>
          <Text className="text-[12px] text-wrap w-60 text-neutral-800">{resolvedEmail}</Text>
        </View>

        {/* Menu */}
        <View className="mt-6 space-y-5">
          {items.map((it) => {
            const Active = it.key === active;
            const Icon = it.icon;
            return (
              <TouchableOpacity
                key={it.key}
                className="flex-row items-center gap-4 rounded-lg py-2 px-1"
                onPress={() => onSelect?.(it.key)}
              >
                <Icon color={Active ? "#0c4a6e" : "#6b7280"} size={24} />
                <Text
                  className={`text-[18px] ${
                    Active ? "font-semibold text-sky-900" : "text-neutral-500"
                  }`}
                >
                  {it.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar2;
