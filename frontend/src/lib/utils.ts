import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date string as a locale date
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

// Format a similarity score as a percentage string
export function formatScore(score?: number) {
  if (!score) return "N/A";
  return (score * 100).toFixed(0) + "%";
}

// Format time remaining from a UTC string
export function formatTimeRemaining(estimatedCompletionTime: string): string {
  try {
    // Parse the UTC time string from backend (format: "YYYY-MM-DD HH:MM:SS UTC")
    const completionTime = new Date(estimatedCompletionTime.replace(' UTC', 'Z'));
    const now = new Date();
    const diffMs = completionTime.getTime() - now.getTime();
    if (diffMs <= 0) {
      return "any moment now";
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      if (seconds > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m`;
      }
    } else {
      return `${seconds}s`;
    }
  } catch (error) {
    // Fallback to original string if parsing fails
    console.warn('Failed to parse estimated completion time:', error);
    return estimatedCompletionTime;
  }
}
