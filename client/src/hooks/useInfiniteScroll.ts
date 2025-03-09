import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /**
   * Function to fetch the next page of data
   */
  fetchNextPage: () => void;

  /**
   * Whether there are more pages to fetch
   */
  hasNextPage?: boolean;

  /**
   * Whether the next page is currently being fetched
   */
  isFetchingNextPage: boolean;

  /**
   * The root margin for the intersection observer
   * @default "0px 0px 400px 0px"
   */
  rootMargin?: string;

  /**
   * The threshold for the intersection observer
   * @default 0
   */
  threshold?: number;

  /**
   * Whether the infinite scrolling should be enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * A hook for implementing infinite scrolling using the Intersection Observer API.
 * Returns a ref that should be attached to the element that triggers the next page load when visible.
 */
export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage,
  rootMargin = "0px 0px 400px 0px",
  threshold = 0,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  // Create a ref for the observer target element
  const observerTarget = useRef<HTMLDivElement>(null);

  // Handle intersection
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        enabled
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, enabled]
  );

  // Set up and clean up the intersection observer
  useEffect(() => {
    const element = observerTarget.current;

    // Skip if not enabled or no element
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver, rootMargin, threshold, enabled]);

  return { observerTarget };
};

export default useInfiniteScroll;
