import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind classes safely.
 * Combines clsx (conditional classes) with twMerge (deduplication).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-bgh-green", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}