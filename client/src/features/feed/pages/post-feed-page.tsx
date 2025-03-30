import { PostFeedSort } from "@/features/feed/components/post-feed-sort";
import { useGetInfinitePosts } from "../hooks/posts/posts.hooks";
import {
  PostFeedList,
  PostFeedListSkeleton,
  PostFeedListError,
} from "../components/post-feed-list";
import {
  TrendingPostsCard,
  WhoToFollowCard,
  UsefulLinksCard,
} from "@/features/feed/components/feed-suggestions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const allPosts = data?.pages.flatMap((page) => page.items) || [];

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

      {/* Grid layout that changes based on screen size */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Feed suggestions cards shown at top on small screens in a carousel, hidden on large screens */}
        <div className="lg:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <TrendingPostsCard />
              </CarouselItem>
              <CarouselItem>
                <WhoToFollowCard />
              </CarouselItem>
              <CarouselItem>
                <UsefulLinksCard />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>

        {/* Main content - full width on small screens, 8 cols on medium+ */}
        <div className="lg:col-span-8">{children}</div>

        {/* FeedSuggestions in normal position on large screens, hidden on small screens */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="space-y-6">
            <TrendingPostsCard />
            <WhoToFollowCard />
            <UsefulLinksCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFeedPage;
