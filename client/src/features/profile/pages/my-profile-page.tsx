import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Edit, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileTabs from "@/features/profile/components/profile-tabs";
import PostCard from "@/features/feed/components/post-card";
import { profileApi } from "../api/users.api";
import { Profile } from "../schemas/profile.schema";
import { Post } from "@/features/feed/schemas/post.schema";
import { Button } from "@/components/ui/button";

const MyProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication
    if (isClerkLoaded && !isSignedIn) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch the user's profile
        const profileData = await profileApi.getCurrentUserProfile();
        setProfile(profileData);

        // Fetch posts and likes using the user ID from the profile
        if (profileData.id) {
          const posts = await profileApi.getUserPosts(profileData.id);
          setUserPosts(posts);

          const liked = await profileApi.getUserLikedPosts(profileData.id);
          setLikedPosts(liked);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [clerkUser, isClerkLoaded, isSignedIn, navigate]);

  // Show loading state
  if (!isClerkLoaded || isLoading) {
    return (
      <div className="flex justify-center p-8">Loading your profile...</div>
    );
  }

  // Show missing profile state
  if (!profile) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
          <p className="mb-4">Your profile information could not be loaded.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
        {profile.coverImageUrl && (
          <img
            src={profile.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}

        {/* Edit Cover button */}
        <button className="absolute bottom-3 right-3 bg-background rounded-md p-2 shadow-sm hover:bg-accent transition-colors">
          <Edit className="h-4 w-4" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-b-lg shadow-sm p-6 mb-6 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 -mt-16 relative">
            <img
              src={clerkUser?.imageUrl || profile.avatarUrl}
              alt={profile.username || ""}
              className="w-24 h-24 rounded-full border-4 border-background"
            />

            {/* Edit avatar button */}
            <button className="absolute bottom-0 right-0 bg-background rounded-full p-1 shadow-sm hover:bg-accent transition-colors">
              <Edit className="h-3 w-3" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.displayName || clerkUser?.fullName}
                </h1>
                <p className="text-muted-foreground">
                  @{profile.username || clerkUser?.username}
                </p>
              </div>

              <Button
                variant="outline"
                className="self-start"
                onClick={() => navigate("/settings/profile")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
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
                {new Date(
                  clerkUser?.createdAt || profile.createdAt
                ).toLocaleDateString("en-US", {
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
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">You haven't created any posts yet.</p>
                <Button onClick={() => navigate("/posts/new")}>
                  Create Your First Post
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="space-y-6">
            {likedPosts.length > 0 ? (
              likedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>You haven't liked any posts yet.</p>
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

export default MyProfilePage;
