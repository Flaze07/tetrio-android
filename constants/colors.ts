export const TAILWIND_COLORS = {
  "slate-500": "#64748b",
  "gray-500": "#6b7280",
  "zinc-500": "#71717a",
  "neutral-500": "#737373",
  "stone-500": "#78716c",
  "red-500": "#ef4444",
  "orange-500": "#f97316",
  "amber-500": "#f59e0b",
  "yellow-500": "#eab308",
  "lime-500": "#84cc16",
  "green-500": "#22c55e",
  "emerald-500": "#10b981",
  "teal-500": "#14b8a6",
  "cyan-500": "#06b6d4",
  "sky-500": "#0ea5e9",
  "blue-500": "#3b82f6",
  "indigo-500": "#6366f1",
  "violet-500": "#8b5cf6",
  "purple-500": "#a855f7",
  "fuchsia-500": "#d946ef",
  "pink-500": "#ec4899",
  "rose-500": "#f43f5e",
  "black": "#000000",
  "white": "#ffffff",
};

export type TailwindColorClass = keyof typeof TAILWIND_COLORS;

export const COLOR_NAME_TO_CLASS = {
  slate: "bg-slate-500",
  gray: "bg-gray-500",
  zinc: "bg-zinc-500",
  neutral: "bg-neutral-500",
  stone: "bg-stone-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  black: "bg-black",
  white: "bg-white",
} as const;

export type TailwindColorName = keyof typeof COLOR_NAME_TO_CLASS;

export const COLOR_OPTIONS = Object.entries(COLOR_NAME_TO_CLASS).map(([name, className]) => ({
  name: name as TailwindColorName,
  className,
}));
