export const CONTEXT_ITEM_KINDS = ["system", "skill", "file", "tool", "user"] as const;

export type ContextItemKind = (typeof CONTEXT_ITEM_KINDS)[number];

export interface ContextItemDefinition {
  label: string;
  shortLabel: string;
  size: number;
  tooltip: string;
}

export interface ContextItem {
  id: number;
  kind: ContextItemKind;
}

export interface ContextWindow {
  items: readonly ContextItem[];
  nextId: number;
}

export const CONTEXT_ITEM_DEFINITIONS: Readonly<Record<ContextItemKind, ContextItemDefinition>> = {
  system: {
    label: "System",
    shortLabel: "S",
    size: 8,
    tooltip: "System prompt · standing instructions",
  },
  skill: {
    label: "Skill",
    shortLabel: "K",
    size: 7,
    tooltip: "Skill file · task-specific method",
  },
  file: {
    label: "File",
    shortLabel: "F",
    size: 10,
    tooltip: "Read file · selected source text",
  },
  tool: {
    label: "Tool",
    shortLabel: "T",
    size: 12,
    tooltip: "Tool output · command or API result",
  },
  user: {
    label: "User",
    shortLabel: "U",
    size: 4,
    tooltip: "User message · request or reply",
  },
};

export function createContextWindow(): ContextWindow {
  return {
    items: [
      { id: 1, kind: "system" },
      { id: 2, kind: "user" },
    ],
    nextId: 3,
  };
}

export function contextUsage(window: ContextWindow): number {
  return window.items.reduce((total, item) => total + CONTEXT_ITEM_DEFINITIONS[item.kind].size, 0);
}

export function addContextItem(window: ContextWindow, kind: ContextItemKind): ContextWindow {
  if (contextUsage(window) + CONTEXT_ITEM_DEFINITIONS[kind].size > 100) return window;

  return {
    items: [...window.items, { id: window.nextId, kind }],
    nextId: window.nextId + 1,
  };
}

export function qualityForUsage(usage: number): number {
  const boundedUsage = Math.min(100, Math.max(0, usage));
  if (boundedUsage <= 40) return 100;

  const pressure = (boundedUsage - 40) / 60;
  return Math.round((100 - 90 * pressure ** 1.7) * 10) / 10;
}

export function contextQuality(window: ContextWindow): number {
  return qualityForUsage(contextUsage(window));
}
