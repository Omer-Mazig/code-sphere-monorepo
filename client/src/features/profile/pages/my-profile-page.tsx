import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Post } from "@/features/feed/schemas/post.schema";
import { Profile } from "../schemas/profile.schema";
import { useGetCurrentUserComplete } from "../hooks/useUsers";

const MyProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Use the new combined query instead of separate queries
  const {
    data: profileCompleteData,
    isLoading,
    isError,
    error,
  } = useGetCurrentUserComplete();

  // Check authentication
  useEffect(() => {
    if (isClerkLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isClerkLoaded, isSignedIn, navigate]);

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
      console.log("Complete profile data loaded:", profileCompleteData);
      setProfile(profileCompleteData.profile);
      setUserPosts(profileCompleteData.posts);
      setLikedPosts(profileCompleteData.likedPosts);
    }
  }, [profileCompleteData]);

  if (isLoading || !isClerkLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Loading...</h1>
          <p>Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Error Loading Profile</h1>
          <p>
            {errorMessage ||
              "There was a problem loading your profile. Please try again later."}
          </p>
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md max-w-md mx-auto text-sm">
            <pre className="whitespace-pre-wrap overflow-auto">
              {error instanceof Error
                ? error.stack
                : "No stack trace available"}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {profile && (
        <>
          {/* Profile Header */}
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={profile.imageUrl || clerkUser?.imageUrl}
                  alt={profile.firstName || "User"}
                  className="w-24 h-24 rounded-full"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-muted-foreground">@{profile.username}</p>

                <p className="mt-4">{profile.bio || "No bio provided"}</p>

                <div className="flex gap-6 mt-4">
                  <div>
                    <span className="font-medium">
                      {profile.followersCount}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      Followers
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      {profile.followingCount}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      Following
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Tabs */}
          <div className="border-b mb-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("posts")}
                className={`pb-2 px-1 ${activeTab === "posts" ? "border-b-2 border-primary font-semibold" : ""}`}
              >
                Posts ({userPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`pb-2 px-1 ${activeTab === "likes" ? "border-b-2 border-primary font-semibold" : ""}`}
              >
                Likes ({likedPosts.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-card p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="mt-2">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>You haven't created any posts yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="space-y-6">
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-card p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="mt-2">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>You haven't liked any posts yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfilePage;
