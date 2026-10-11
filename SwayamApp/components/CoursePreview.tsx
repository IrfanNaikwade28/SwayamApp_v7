import React, { useEffect } from "react";
import { BackHandler, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useCourseUI } from "../context/CourseUIContext";

export const CoursePreview: React.FC = () => {
  const { selectedCourse, setScreen } = useCourseUI();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const onBack = () => {
      setScreen("list");
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [setScreen]);

  if (!selectedCourse) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-100">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-neutral-700">No course selected.</Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-sky-700 px-5 py-3"
            onPress={() => setScreen("list")}
          >
            <Text className="text-white font-semibold">Back to Courses</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const preview = selectedCourse.preview;
  const subtitle = [preview.instructor, preview.institute].filter(Boolean).join(" | ");
  const openVideo = () => {
    if (!preview.videoUrl) return;
    Linking.openURL(preview.videoUrl).catch(() => {
      // ignore invalid URL
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ececf4]">
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-neutral-200">
        <TouchableOpacity onPress={() => setScreen("list")} className="w-8">
          <Feather name="arrow-left" size={26} color="#202124" />
        </TouchableOpacity>
        <Text className="text-[18px] font-semibold text-neutral-900">Course Preview</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Feather name="share-2" size={28} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="rotate-cw" size={34} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 96, 120) }}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-56 bg-neutral-800 px-4 py-4">
          {preview.videoUrl ? (
            <View className="flex-1 flex-row items-start justify-start px-3 pt-1">
              <Feather name="alert-circle" size={54} color="#d1d5db" />
              <View className="ml-3 mt-1">
                <TouchableOpacity onPress={openVideo}>
                  <Text className="text-neutral-200 text-[12px] underline font-semibold">Watch video on YouTube</Text>
                </TouchableOpacity>
                <Text className="text-neutral-100 text-[12px] mt-1">
                  {preview.videoErrorCode || "Error 153"}
                </Text>
                <Text className="text-neutral-100 text-[12px] mt-1">
                  {preview.videoErrorMessage || "Video player configuration error"}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-neutral-300 text-base">Video preview unavailable</Text>
            </View>
          )}
        </View>

        <View className="px-5 pt-6">
          {(preview.learnersEnrolled || preview.examRegistrations) && (
            <View className="mb-5">
              {preview.learnersEnrolled ? (
                <Text className="text-[17px] font-semibold text-green-700 text-center">
                  Learners Enrolled: {preview.learnersEnrolled}
                </Text>
              ) : null}
              {preview.examRegistrations ? (
                <Text className="text-[17px] font-semibold text-orange-700 text-center mt-1">
                  Exam Registrations: {preview.examRegistrations}
                </Text>
              ) : null}
            </View>
          )}

          <Text className="text-[24px] leading-[32px] font-semibold text-neutral-900 text-center">
            {selectedCourse.title}
          </Text>
          {subtitle ? (
            <Text className="text-[17px] text-neutral-600 text-center mt-2">{subtitle}</Text>
          ) : null}

          {preview.about ? (
            <View className="mt-7">
              <Text className="text-[17px] font-bold text-neutral-900">ABOUT THE COURSE :</Text>
              <Text className="text-[16px] leading-[24px] text-neutral-900 mt-2">{preview.about}</Text>
            </View>
          ) : null}

        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 bg-neutral-100 border-t border-neutral-300 px-4"
        style={{ paddingBottom: Math.max(insets.bottom, 10), paddingTop: 12 }}
      >
        <TouchableOpacity className="rounded-xl bg-[#2a7ed8] py-4" onPress={() => setScreen("weeks")}>
          <Text className="text-center text-white text-lg font-semibold">Go To Course</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CoursePreview;
