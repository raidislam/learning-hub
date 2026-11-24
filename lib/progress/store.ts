"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Skill = "explain" | "write" | "debug" | "use";
export const SKILLS: { id: Skill; label: string; hint: string }[] = [
  { id: "explain", label: "আমি এটা নিজের ভাষায় explain করতে পারি", hint: "কাউকে না দেখে ৩ মিনিটে বুঝিয়ে বলতে পারলে টিক দিন" },
  { id: "write", label: "আমি দেখা ছাড়া এটা লিখতে পারি", hint: "solution না দেখে খালি editor এ লিখতে পেরেছেন" },
  { id: "debug", label: "আমি এই বিষয়ের bug খুঁজে ঠিক করতে পারি", hint: "Debugging section এর ভুলগুলো নিজে ঠিক করতে পেরেছেন" },
  { id: "use", label: "আমি এটা বাস্তব কাজে ব্যবহার করতে পারি", hint: "Real-world challenge বা নিজের project এ ব্যবহার করেছেন" },
];

export interface QuizResult {
  score: number;
  total: number;
  at: number;
  coding: Record<number, boolean>;
}

/** Fraction of MCQs that must be correct before a topic can count as complete. */
export const PASS_RATIO = 0.8;

interface ProgressState {
  hydrated: boolean;
  visited: Record<string, number>;
  skills: Record<string, Partial<Record<Skill, boolean>>>;
  quiz: Record<string, QuizResult>;
  bookmarks: string[];
  notes: Record<string, string>;
  markVisited: (key: string) => void;
  toggleSkill: (key: string, skill: Skill) => void;
  saveMcq: (key: string, score: number, total: number) => void;
  saveCoding: (key: string, index: number, passed: boolean) => void;
  toggleBookmark: (key: string) => void;
  setNote: (key: string, text: string) => void;
  resetTopic: (key: string) => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      hydrated: false,
      visited: {},
      skills: {},
      quiz: {},
      bookmarks: [],
      notes: {},
      markVisited: (key) => set((s) => ({ visited: { ...s.visited, [key]: Date.now() } })),
      toggleSkill: (key, skill) =>
        set((s) => ({
          skills: { ...s.skills, [key]: { ...s.skills[key], [skill]: !s.skills[key]?.[skill] } },
        })),
      saveMcq: (key, score, total) =>
        set((s) => {
          const prev = s.quiz[key];
          // keep the best attempt
          if (prev && prev.total > 0 && prev.score / prev.total >= score / total) return s;
          return { quiz: { ...s.quiz, [key]: { score, total, at: Date.now(), coding: prev?.coding ?? {} } } };
        }),
      saveCoding: (key, index, passed) =>
        set((s) => {
          const prev = s.quiz[key] ?? { score: 0, total: 0, at: Date.now(), coding: {} };
          if (prev.coding[index] === passed) return s;
          return { quiz: { ...s.quiz, [key]: { ...prev, coding: { ...prev.coding, [index]: passed } } } };
        }),
      toggleBookmark: (key) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(key) ? s.bookmarks.filter((k) => k !== key) : [...s.bookmarks, key],
        })),
      setNote: (key, text) => set((s) => ({ notes: { ...s.notes, [key]: text } })),
      resetTopic: (key) =>
        set((s) => {
          const skills = { ...s.skills };
          const quiz = { ...s.quiz };
          delete skills[key];
          delete quiz[key];
          return { skills, quiz };
        }),
    }),
    {
      name: "js-learning-hub:v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        visited: s.visited,
        skills: s.skills,
        quiz: s.quiz,
        bookmarks: s.bookmarks,
        notes: s.notes,
      }),
      onRehydrateStorage: () => () => useProgress.setState({ hydrated: true }),
    },
  ),
);

export type TopicStatus = "not-started" | "in-progress" | "complete";

export function skillCount(s: ProgressState, key: string) {
  const sk = s.skills[key] ?? {};
  return SKILLS.filter((x) => sk[x.id]).length;
}

export function quizPassed(s: ProgressState, key: string) {
  const q = s.quiz[key];
  return !!q && q.total > 0 && q.score / q.total >= PASS_RATIO;
}

/**
 * A topic is complete only when ALL four self-checks are ticked AND the MCQ
 * assessment was passed. Opening a page never completes it.
 */
export function topicStatus(s: ProgressState, key: string): TopicStatus {
  const n = skillCount(s, key);
  if (n === SKILLS.length && quizPassed(s, key)) return "complete";
  if (n > 0 || s.quiz[key] || s.visited[key]) return "in-progress";
  return "not-started";
}
