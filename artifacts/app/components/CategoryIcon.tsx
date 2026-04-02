import { Feather } from "@expo/vector-icons";
import React from "react";

type Category =
  | "delivery"
  | "micromobility"
  | "carsharing"
  | "taxi"
  | "car"
  | "other";

const CATEGORY_ICONS: Record<Category, string> = {
  delivery: "package",
  micromobility: "zap",
  carsharing: "key",
  taxi: "navigation",
  car: "truck",
  other: "alert-circle",
};

const CATEGORY_COLORS: Record<Category, string> = {
  delivery: "#F97316",
  micromobility: "#AAFF00",
  carsharing: "#60A5FA",
  taxi: "#FCD34D",
  car: "#EF4444",
  other: "#9CA3AF",
};

interface Props {
  category: Category;
  size?: number;
  color?: string;
}

export function CategoryIcon({ category, size = 20, color }: Props) {
  const iconName = CATEGORY_ICONS[category] ?? "alert-circle";
  const iconColor = color ?? CATEGORY_COLORS[category] ?? "#9CA3AF";
  return <Feather name={iconName as any} size={size} color={iconColor} />;
}

export { CATEGORY_COLORS, CATEGORY_ICONS };
