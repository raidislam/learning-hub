export type TrackId = "core" | "frontend" | "backend" | "dsa";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface TopicDef {
  slug: string;
  title: string;
}

export interface ModuleDef {
  id: string; // e.g. "m01"
  slug: string; // URL segment
  number: number;
  title: string;
  summary: string; // Bangla
  difficulty: Difficulty;
  /** module ids that should be done first */
  prerequisites: string[];
  topics: TopicDef[];
}

export interface TrackDef {
  id: TrackId;
  slug: string; // URL segment
  title: string;
  shortTitle: string;
  summary: string; // Bangla
  priority: string; // Bangla
  difficulty: Difficulty;
  prerequisites: string; // Bangla
  modules: ModuleDef[];
}
