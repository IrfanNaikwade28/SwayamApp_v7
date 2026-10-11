import React from "react";
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourseUI } from "../context/CourseUIContext";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Award,
  Book,
  LogOut,
  HelpCircle,
  Info,
  Settings as SettingsIcon,
  User,
} from "lucide-react-native";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  active?: string;
  email?: string;
  onSelect?: (key: string) => void;
};

export const Sidebar1: React.FC<SidebarProps> = ({
  open,
  onClose,
  active = "My Courses",
  email = "",
  onSelect,
}) => {
  const { profile } = useCourseUI();
  // derive email from context if not passed
  const resolvedEmail = email || profile.email;
  const items = [
    { key: "Home", icon: Home },
    { key: "Dashboard", icon: LayoutDashboard },
    { key: "My Courses", icon: BookOpen },
    { key: "My Certifications", icon: Award },
    { key: "Course Catalog", icon: Book },
    { key: "Sign Out", icon: LogOut },
    { key: "Faq", icon: HelpCircle },
    { key: "About", icon: Info },
    { key: "Setting", icon: SettingsIcon },
  ];

  return (
    <Modal
      visible={open}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40" />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <View className="absolute left-0 top-0 h-full w-[78%] max-w-[340px] bg-white border-r border-neutral-200 overflow-hidden">
        <SafeAreaView>
          {/* Profile Card */}
          <View className="px-4 pt-6">
            <View className="flex-row items-center gap-3 border border-neutral-200 bg-neutral-50 px-2 py-4">
              <View className="h-10 w-10 rounded-full bg-white justify-center items-center">
                <User color="#555" size={24} />
              </View>
              <Text className="text-[10px] text-neutral-800" numberOfLines={1}>
                {resolvedEmail}
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView className="mt-6 px-4">
            {items.map((it) => {
              const Active = it.key === active;
              const Icon = it.icon;
              return (
                <TouchableOpacity
                  key={it.key}
                  className="flex-row items-center gap-4 rounded-lg px-1 py-2"
                  onPress={() => {
                    if (it.key === "Sign Out") {
                      // handle logout if needed
                    } else {
                      onSelect?.(it.key);
                      onClose();
                    }
                  }}
                >
                  <Icon
                    size={22}
                    color={Active ? "#0c4a6e" : "#6b7280"}
                    strokeWidth={2}
                  />
                  <Text
                    className={`text-[14px] ${
                      Active ? "text-sky-900 font-semibold" : "text-neutral-500"
                    }`}
                  >
                    {it.key}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View className="h-10" />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default Sidebar1;
