import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import ProfileTabs from "@/features/profile/components/profile-tabs";
import PostCard from "@/features/feed/components/post-card";
import { profileApi } from "../api/users.api";
import { Profile } from "../schemas/profile.schema";
import { Post } from "@/features/feed/schemas/post.schema";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { username } = useParams<{ username?: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      // If no username is provided, redirect to the current user's profile
      navigate("/profile/me");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // Fetch the user profile by username
        const profileData = await profileApi.getUserByUsername(username);
        setProfile(profileData);
        setIsFollowing(!!profileData.isFollowing);

        // Fetch posts and likes
        if (profileData.id) {
          const posts = await profileApi.getUserPosts(profileData.id);
          setUserPosts(posts);

          const liked = await profileApi.getUserLikedPosts(profileData.id);
          setLikedPosts(liked);
        }
      } catch (error) {
        console.error(`Error fetching data for ${username}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username, navigate]);

  const handleFollowToggle = async () => {
    if (!profile || !isClerkLoaded || !isSignedIn) {
      if (!isSignedIn) {
        navigate("/login");
      }
      return;
    }

    try {
      setIsFollowingLoading(true);

      if (isFollowing) {
        await profileApi.unfollowUser(profile.id);
        setIsFollowing(false);
        if (profile.followersCount > 0) {
          setProfile({
            ...profile,
            followersCount: profile.followersCount - 1,
          });
        }
      } else {
        await profileApi.followUser(profile.id);
        setIsFollowing(true);
        setProfile({
          ...profile,
          followersCount: profile.followersCount + 1,
        });
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (!profile) {
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
                  disabled={isFollowingLoading}
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
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
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
              likedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
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
