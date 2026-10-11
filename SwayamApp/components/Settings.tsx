import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useCourseUI } from "../context/CourseUIContext";

export const Settings: React.FC = () => {
  const { setScreen, lastScreen, profile, setProfile, subjects, addSubject, updateSubject, deleteSubject } = useCourseUI();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [name, setName] = React.useState(profile.name);
  const [email, setEmail] = React.useState(profile.email);
  
  // Local editor state (keep existing styling; just wiring)
  type EditorState = {
    id?: number;
    title: string;
    totalWeeks: string; // weeksCount as string for input
    start: string;
    dateEnrolled: string;
    assessmentTitles: string; // textarea lines
    scores: string; // comma separated
    unitTitles: string; // textarea lines
    unitProgress: string; // comma separated
    assessmentProgress: string; // comma separated, '-' allowed
  };
  const emptyEditor: EditorState = {
    title: "",
    totalWeeks: "",
    start: "",
    dateEnrolled: "",
    assessmentTitles: "",
    scores: "",
    unitTitles: "",
    unitProgress: "",
    assessmentProgress: "",
  };
  const [editing, setEditing] = useState<number | null>(null);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);

  // Android hardware back from Settings should go back to the previous screen, not exit the app
  useEffect(() => {
    const onBack = () => {
      setScreen(lastScreen || "list");
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [lastScreen, setScreen]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToBottomAfterKeyboard = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 140);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
      <ScrollView
        ref={scrollRef}
        className="px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingBottom: keyboardVisible
            ? Math.max(insets.bottom + 360, 420)
            : Math.max(insets.bottom + 24, 40),
        }}
      >
        <View className="py-4">
          <Text className="text-xl font-semibold text-neutral-900">Setting</Text>
        </View>
        {/* Profile section (untouched styling) */}
        <Text className="mb-2 text-[13px] text-neutral-600">Name</Text>
        <TextInput
          className="mb-4 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9ca3af"
        />
        <Text className="mb-2 text-[13px] text-neutral-600">Email</Text>
        <TextInput
          className="mb-6 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9ca3af"
        />

        <TouchableOpacity
          className="rounded-lg bg-sky-900 py-3"
          onPress={() => {
            const n = name.trim();
            const e = email.trim();
            if (!n) {
              Alert.alert("Name required", "Please enter your name.");
              return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
              Alert.alert(
                "Invalid email",
                "Please enter a valid email address."
              );
              return;
            }
            setProfile({ name: n, email: e });
            Alert.alert("Saved", "Profile updated.");
          }}
        >
          <Text className="text-center text-white font-semibold">Save</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="h-[1px] bg-neutral-200 my-6" />

        {/* Courses management (keep styling pattern: borders, bg-white, rounded) */}
        <Text className="text-lg font-semibold text-neutral-900 mb-3">Manage Courses</Text>

        {/* Course list */}
        {subjects.map((c) => (
          <View key={c.id} className="mb-3 rounded-lg border border-neutral-300 bg-white p-3">
            <Text className="text-[15px] font-semibold text-neutral-900 mb-1">{c.title}</Text>
            <Text className="text-[13px] text-neutral-700">Weeks: {c.totalWeeks} | Starts: {c.start}</Text>
            <View className="flex-row gap-3 mt-3">
              <TouchableOpacity
                className="rounded-lg border border-neutral-300 px-4 py-2"
                onPress={() => {
                  setEditing(c.id);
                  setEditor({
                    id: c.id,
                    title: c.title,
                    totalWeeks: String(c.totalWeeks ?? ""),
                    start: c.start,
                    dateEnrolled: c.progress?.dateEnrolled ?? "",
                    assessmentTitles: (c.progress?.assessmentTitles ?? []).join("\n"),
                    scores: (c.progress?.scores ?? []).join(","),
                    unitTitles: (c.progress?.unitTitles ?? []).join("\n"),
                    unitProgress: (c.progress?.unitProgress ?? []).join(","),
                    assessmentProgress: (c.progress?.assessmentProgress ?? []).map((v)=> v==null? "-" : String(v)).join(","),
                  });
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 120);
                }}
              >
                <Text className="text-[14px] text-neutral-800">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg border border-neutral-300 px-4 py-2"
                onPress={() => {
                  Alert.alert("Delete Course", `Delete \"${c.title}\"?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteSubject(c.id) },
                  ]);
                }}
              >
                <Text className="text-[14px] text-red-700">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Editor card */}
        <View className="mt-4 rounded-lg border border-neutral-300 bg-white p-3">
          <Text className="text-[15px] font-semibold text-neutral-900 mb-3">{editing ? "Edit Course" : "Add New Course"}</Text>

          <Text className="mb-2 text-[13px] text-neutral-600">Title</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="Course title"
            value={editor.title}
            onChangeText={(v)=>setEditor((e)=>({ ...e, title: v }))}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Weeks Count</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="e.g. 8 or 12"
            keyboardType="numeric"
            value={editor.totalWeeks}
            onChangeText={(v)=>setEditor((e)=>({ ...e, totalWeeks: v }))}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Start (e.g. Mon Aug 18 2025)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="Mon Aug 18 2025"
            value={editor.start}
            onChangeText={(v)=>setEditor((e)=>({ ...e, start: v }))}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Date Enrolled (YYYY-MM-DD)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="2025-07-21"
            value={editor.dateEnrolled}
            onChangeText={(v)=>setEditor((e)=>({ ...e, dateEnrolled: v }))}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Assessment Titles (one per line)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder={`Week 1 : Assignment 1:\nWeek 2 : Assignment 2:`}
            value={editor.assessmentTitles}
            onChangeText={(v)=>setEditor((e)=>({ ...e, assessmentTitles: v }))}
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Assessment Scores (comma separated)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="90,100,85,-,78"
            value={editor.scores}
            onChangeText={(v)=>setEditor((e)=>({ ...e, scores: v }))}
            onFocus={scrollToBottomAfterKeyboard}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Unit Titles (one per line)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder={`Week 1\nWeek 2\nWeek 3`}
            value={editor.unitTitles}
            onChangeText={(v)=>setEditor((e)=>({ ...e, unitTitles: v }))}
            onFocus={scrollToBottomAfterKeyboard}
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Unit Progress % (comma separated)</Text>
          <TextInput
            className="mb-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="100,80,75,0"
            value={editor.unitProgress}
            onChangeText={(v)=>setEditor((e)=>({ ...e, unitProgress: v }))}
            onFocus={scrollToBottomAfterKeyboard}
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-2 text-[13px] text-neutral-600">Assessment Progress % (comma separated; use - for none)</Text>
          <TextInput
            className="mb-4 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            placeholder="-,100,100,0"
            value={editor.assessmentProgress}
            onChangeText={(v)=>setEditor((e)=>({ ...e, assessmentProgress: v }))}
            onFocus={scrollToBottomAfterKeyboard}
            placeholderTextColor="#9ca3af"
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="rounded-lg bg-sky-900 py-3 px-5"
              onPress={() => {
                const title = editor.title.trim();
                const totalWeeks = parseInt(editor.totalWeeks.trim() || "0", 10);
                const start = editor.start.trim();
                if (!title || !Number.isFinite(totalWeeks) || totalWeeks <= 0 || !start) {
                  Alert.alert("Invalid input", "Please fill Title, Weeks Count (>0), and Start date.");
                  return;
                }
                const parseCommaNums = (s: string): number[] =>
                  s.split(",").map((x) => parseFloat(x.trim())).filter((n) => Number.isFinite(n));
                const parseCommaNumsOrNull = (s: string): (number | null)[] =>
                  s.split(",").map((x) => (x.trim() === "-" || x.trim() === "" ? null : parseFloat(x.trim()))).map((n) => (n == null || !Number.isFinite(n as any) ? null : (n as number)));
                const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

                const progress = {
                  assessmentTitles: lines(editor.assessmentTitles),
                  scores: editor.scores.split(",").map((x) => x.trim()).filter((x) => x.length > 0),
                  unitTitles: lines(editor.unitTitles),
                  unitProgress: parseCommaNums(editor.unitProgress),
                  assessmentProgress: parseCommaNumsOrNull(editor.assessmentProgress),
                  dateEnrolled: editor.dateEnrolled.trim(),
                };

                if (editing) {
                  // Update without touching weeks
                  const patch = {
                    title,
                    start,
                    totalWeeks,
                    progress,
                  } as const;
                  updateSubject(editing, patch as any);
                  Alert.alert("Saved", "Course updated.");
                } else {
                  // Add without providing weeks; context injects constant weeks template
                  const payload = {
                    title,
                    start,
                    totalWeeks,
                    progress,
                  } as const;
                  addSubject(payload as any);
                  Alert.alert("Added", "Course added.");
                }
                setEditor(emptyEditor);
                setEditing(null);
              }}
            >
              <Text className="text-center text-white font-semibold">{editing ? "Save" : "Add"}</Text>
            </TouchableOpacity>

            {editing && (
              <TouchableOpacity
                className="rounded-lg border border-neutral-300 py-3 px-5"
                onPress={() => {
                  setEditing(null);
                  setEditor(emptyEditor);
                }}
              >
                <Text className="text-center text-neutral-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Settings;

