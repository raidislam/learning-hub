import type { Lesson } from "@/types/lesson";

/**
 * Lesson registry. Key = `${trackSlug}/${moduleSlug}/${topicSlug}`.
 * To add a lesson: create a content file exporting `lesson: Lesson`
 * and register a lazy loader here. Topics without an entry are shown
 * as "planned" in the curriculum and have no route.
 */
export const lessonLoaders: Record<string, () => Promise<{ lesson: Lesson }>> = {
  "core-javascript/fundamentals/what-is-javascript": () => import("./core/fundamentals/what-is-javascript"),
  "core-javascript/fundamentals/how-javascript-works-in-the-browser": () => import("./core/fundamentals/how-javascript-works-in-the-browser"),
  "core-javascript/fundamentals/javascript-runtime": () => import("./core/fundamentals/javascript-runtime"),
  "core-javascript/fundamentals/javascript-engine": () => import("./core/fundamentals/javascript-engine"),
  "core-javascript/fundamentals/v8-engine": () => import("./core/fundamentals/v8-engine"),
  "core-javascript/fundamentals/var-let-const": () => import("./core/fundamentals/var-let-const"),
  "core-javascript/fundamentals/data-types": () => import("./core/fundamentals/data-types"),
  "core-javascript/fundamentals/primitive-vs-reference-types": () => import("./core/fundamentals/primitive-vs-reference-types"),
  "core-javascript/fundamentals/type-conversion": () => import("./core/fundamentals/type-conversion"),
  "core-javascript/fundamentals/type-coercion": () => import("./core/fundamentals/type-coercion"),
  "core-javascript/fundamentals/operators": () => import("./core/fundamentals/operators"),
  "core-javascript/fundamentals/equality": () => import("./core/fundamentals/equality"),
  "core-javascript/fundamentals/truthy-and-falsy": () => import("./core/fundamentals/truthy-and-falsy"),
  "core-javascript/fundamentals/conditional-statements": () => import("./core/fundamentals/conditional-statements"),
  "core-javascript/fundamentals/loops": () => import("./core/fundamentals/loops"),
  "core-javascript/fundamentals/error-handling": () => import("./core/fundamentals/error-handling"),
  "core-javascript/functions/function-declaration": () => import("./core/functions/function-declaration"),
  "core-javascript/functions/function-expression": () => import("./core/functions/function-expression"),
  "core-javascript/functions/arrow-functions": () => import("./core/functions/arrow-functions"),
  "core-javascript/functions/parameters-and-arguments": () => import("./core/functions/parameters-and-arguments"),
  "core-javascript/functions/default-parameters": () => import("./core/functions/default-parameters"),
  "core-javascript/functions/return": () => import("./core/functions/return"),
  "core-javascript/functions/callback-functions": () => import("./core/functions/callback-functions"),
  "core-javascript/functions/higher-order-functions": () => import("./core/functions/higher-order-functions"),
  "core-javascript/functions/pure-functions": () => import("./core/functions/pure-functions"),
  "core-javascript/functions/closures": () => import("./core/functions/closures"),
  "core-javascript/functions/lexical-scope": () => import("./core/functions/lexical-scope"),
  "core-javascript/functions/scope-chain": () => import("./core/functions/scope-chain"),
  "core-javascript/functions/recursion": () => import("./core/functions/recursion"),
  "core-javascript/functions/iife": () => import("./core/functions/iife"),
  "core-javascript/functions/this-keyword": () => import("./core/functions/this-keyword"),
  "core-javascript/functions/call-apply-bind": () => import("./core/functions/call-apply-bind"),
};
