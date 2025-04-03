const MAX_RETRIES = 3;

/**
 * Handles the retry logic for queries
 * Returns true if the query should be retried, false otherwise
 */
export const handleRetry = (
  failureCount: number,
  error: unknown,
  retryLimit: number = MAX_RETRIES
) => {
  // Retry on server errors (500+)
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 500
  ) {
    return failureCount < retryLimit;
  }

  // Retry when server is down (status 0)
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response &&
    typeof error.response.status === "number" &&
    error.response.status === 0
  ) {
    return failureCount < retryLimit;
  }

  return false;
};
