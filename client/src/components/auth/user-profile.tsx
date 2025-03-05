import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUserProfileComplete } from "@/features/profile/hooks/useUsers";
import { Post } from "@/features/feed/schemas/post.schema";
import { Profile } from "@/features/profile/schemas/profile.schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PostCard from "@/features/feed/components/post-card";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use the consolidated profile data query
  const {
    data: profileCompleteData,
    isLoading,
    isError,
    error,
  } = useGetUserProfileComplete(id as string);

  // Log errors for debugging
  useEffect(() => {
    if (isError) {
      console.error("Profile error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }, [isError, error]);

  // Update local state when the combined data changes
  useEffect(() => {
    if (profileCompleteData) {
      setProfile(profileCompleteData.profile);
      setUserPosts(profileCompleteData.posts);
      setLikedPosts(profileCompleteData.likedPosts);
    }
  }, [profileCompleteData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or you may not have
            permission to view it.
          </p>
          {errorMessage && (
            <p className="text-red-500 mt-2">Error: {errorMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={""}
            alt={"baba"}
          />
          <AvatarFallback>
            {profile.username?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-muted-foreground mb-4">
            {profile.bio || "No bio provided"}
          </p>

          <div className="flex gap-4 mb-4">
            <div>
              <span className="font-bold">{profile.followersCount || 0}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-bold">{profile.followingCount || 0}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full md:w-auto"
          >
            Follow
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="posts"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>

        <TabsContent
          value="posts"
          className="mt-6"
        >
          {userPosts.length === 0 ? (
            <Card className="p-6 text-center">
              <p>No posts yet</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="likes"
          className="mt-6"
        >
          {likedPosts.length === 0 ? (
            <Card className="p-6 text-center">
              <p>No liked posts yet</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {likedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
