import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileTabs from "@/features/user/components/profile-tabs";
import PostCard from "@/features/feed/components/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserById } from "../api/users.api";
import {
  useGetUserPosts,
  useGetUserLikedPosts,
} from "@/features/feed/hooks/usePosts";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const { isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch profile data
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  // Fetch user posts with infinite scrolling
  const {
    data: userPostsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextUserPosts,
    hasNextPage: hasMoreUserPosts,
    isFetchingNextPage: isFetchingNextUserPosts,
  } = useGetUserPosts(profile?.id || "", 10);

  // Fetch liked posts with infinite scrolling
  const {
    data: likedPostsData,
    isLoading: isLikesLoading,
    fetchNextPage: fetchNextLikedPosts,
    hasNextPage: hasMoreLikedPosts,
    isFetchingNextPage: isFetchingNextLikedPosts,
  } = useGetUserLikedPosts(profile?.id || "", 10);

  // Set up infinite scrolling for posts
  const { observerTarget: postsObserver } = useInfiniteScroll({
    fetchNextPage: fetchNextUserPosts,
    hasNextPage: hasMoreUserPosts,
    isFetchingNextPage: isFetchingNextUserPosts,
    enabled: activeTab === "posts",
  });

  // Set up infinite scrolling for liked posts
  const { observerTarget: likesObserver } = useInfiniteScroll({
    fetchNextPage: fetchNextLikedPosts,
    hasNextPage: hasMoreLikedPosts,
    isFetchingNextPage: isFetchingNextLikedPosts,
    enabled: activeTab === "likes",
  });

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: () =>
      isFollowing ? unfollowUser(profile!.id) : followUser(profile!.id),
    onSuccess: () => {
      // Invalidate queries to refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const isLoading = isProfileLoading || isPostsLoading || isLikesLoading;
  const isFollowing = !!profile?.isFollowing;

  // Flatten post arrays from pages
  const userPosts = userPostsData?.pages.flatMap((page) => page.posts) || [];
  const likedPosts = likedPostsData?.pages.flatMap((page) => page.posts) || [];

  const handleFollowToggle = async () => {
    if (!profile || !isClerkLoaded || !isSignedIn) {
      if (!isSignedIn) {
        navigate("/login");
      }
      return;
    }

    followMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (profileError || !profile) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">User Not Found</h2>
          <p className="mb-4">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
        {profile.coverImageUrl && (
          <img
            src={profile.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-b-lg shadow-sm p-6 mb-6 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 -mt-16">
            <img
              src={profile.avatarUrl}
              alt={profile.username || ""}
              className="w-24 h-24 rounded-full border-4 border-background"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>

              {isClerkLoaded && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="self-start"
                  onClick={handleFollowToggle}
                  disabled={followMutation.isPending}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>

            <p className="mt-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {profile.location}
                </div>
              )}

              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              {profile.website && (
                <div className="flex items-center">
                  <LinkIcon className="mr-1 h-4 w-4" />
                  <Link
                    to={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, "")}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-6 mt-4">
              <div>
                <span className="font-medium">{profile.followersCount}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-medium">{profile.followingCount}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        postsCount={userPosts.length}
        likesCount={likedPosts.length}
        aboutText={profile.bio || ""}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "posts" && (
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              <>
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                ))}

                {/* Loading indicator */}
                {isFetchingNextUserPosts && (
                  <div className="py-4 text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Loading more posts...
                    </p>
                  </div>
                )}

                {/* Observer element */}
                <div
                  ref={postsObserver}
                  className="h-4"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                This user hasn't posted anything yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="space-y-6">
            {likedPosts.length > 0 ? (
              <>
                {likedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                ))}

                {/* Loading indicator */}
                {isFetchingNextLikedPosts && (
                  <div className="py-4 text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Loading more posts...
                    </p>
                  </div>
                )}

                {/* Observer element */}
                <div
                  ref={likesObserver}
                  className="h-4"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                This user hasn't liked any posts yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p>{profile.bio || "No bio provided"}</p>

            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
