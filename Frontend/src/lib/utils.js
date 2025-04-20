// lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines className strings with tailwind-specific optimizations
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}