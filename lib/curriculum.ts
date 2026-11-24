import { TRACKS } from "@/content/curriculum";
import { lessonLoaders } from "@/content/lessons";
import type { ModuleDef, TopicDef, TrackDef } from "@/types/curriculum";

export { TRACKS };

export const topicKey = (trackSlug: string, moduleSlug: string, topicSlug: string) =>
  `${trackSlug}/${moduleSlug}/${topicSlug}`;

export const hasLesson = (key: string) => key in lessonLoaders;
export const lessonKeys = () => Object.keys(lessonLoaders);

export function getTrack(slug: string): TrackDef | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function getModule(trackSlug: string, moduleSlug: string): { track: TrackDef; module: ModuleDef } | undefined {
  const track = getTrack(trackSlug);
  const mod = track?.modules.find((m) => m.slug === moduleSlug);
  return track && mod ? { track, module: mod } : undefined;
}

export function getTopic(trackSlug: string, moduleSlug: string, topicSlug: string) {
  const found = getModule(trackSlug, moduleSlug);
  const topic = found?.module.topics.find((t) => t.slug === topicSlug);
  return found && topic ? { ...found, topic } : undefined;
}

export interface FlatTopic {
  key: string;
  track: TrackDef;
  module: ModuleDef;
  topic: TopicDef;
  available: boolean;
}

export function flatTopics(track?: TrackDef): FlatTopic[] {
  const tracks = track ? [track] : TRACKS;
  return tracks.flatMap((tr) =>
    tr.modules.flatMap((m) =>
      m.topics.map((topic) => {
        const key = topicKey(tr.slug, m.slug, topic.slug);
        return { key, track: tr, module: m, topic, available: hasLesson(key) };
      }),
    ),
  );
}

export const topicHref = (key: string) => `/${key}`;

/** Next topic (in curriculum order) that has a lesson, after `key`. */
export function nextAvailable(key: string): FlatTopic | undefined {
  const all = flatTopics();
  const i = all.findIndex((t) => t.key === key);
  return all.slice(i + 1).find((t) => t.available);
}

export function findModuleById(id: string): { track: TrackDef; module: ModuleDef } | undefined {
  for (const track of TRACKS) {
    const mod = track.modules.find((m) => m.id === id);
    if (mod) return { track, module: mod };
  }
}

export const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;
