"use client";

import type { VisualSpec } from "@/types/lesson";
import { FlowVisualizer } from "./FlowVisualizer";
import { MemoryVisualizer } from "./MemoryVisualizer";

/** Visualizer registry: maps a content `VisualSpec.kind` to its component. */
export function Visual({ spec }: { spec: VisualSpec }) {
  switch (spec.kind) {
    case "memory-steps":
      return <MemoryVisualizer spec={spec} />;
    case "flow-steps":
      return <FlowVisualizer spec={spec} />;
  }
}
