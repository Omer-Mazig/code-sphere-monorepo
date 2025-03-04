// Example utility functions

/**
 * Format a date to a string
 */
export function formatDate(date: Date, format: string = "yyyy-MM-dd"): string {
  // Placeholder implementation
  return date.toISOString().split("T")[0];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Add more utility functions as needed
