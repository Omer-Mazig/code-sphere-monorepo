import { PostFeedSort } from "@/features/feed/components/post-feed-sort";
import { useGetInfinitePosts } from "../hooks/posts/posts.hooks";
import {
  PostFeedList,
  PostFeedListSkeleton,
  PostFeedListError,
} from "../components/post-feed-list";

const PostFeedPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetInfinitePosts();

  // Flatten all pages of posts into a single array
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  if (data) {
    return (
      <PostFeedPageLayout>
        <PostFeedList
          allPosts={allPosts}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </PostFeedPageLayout>
    );
  }

  if (isLoading) {
    return (
      <PostFeedPageLayout>
        <PostFeedListSkeleton />
      </PostFeedPageLayout>
    );
  }

  if (isError) {
    return (
      <PostFeedPageLayout>
        <PostFeedListError refetch={refetch} />
      </PostFeedPageLayout>
    );
  }
};

const PostFeedPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Feed</h1>
        <PostFeedSort />
      </div>
      {children}
    </div>
  );
};

export default PostFeedPage;
