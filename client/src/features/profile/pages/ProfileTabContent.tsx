import { useOutletContext } from "react-router-dom";
import ProfilePosts from "../components/ProfilePosts";
import ProfileLikedPosts from "../components/ProfileLikedPosts";
import ProfileComments from "../components/ProfileComments";
import ProfileFollowers from "../components/ProfileFollowers";
import ProfileFollowing from "../components/ProfileFollowing";

type UserData = {
  posts: any[];
  likedPosts: any[];
  comments: any[];
  followers: any[];
  following: any[];
};

type ProfileContextType = {
  userData: UserData;
  isOwnProfile: boolean;
};

// Posts tab content
export function ProfilePostsTab() {
  const { userData, isOwnProfile } = useOutletContext<ProfileContextType>();
  return (
    <ProfilePosts
      posts={userData.posts}
      isOwnProfile={isOwnProfile}
    />
  );
}

// Liked posts tab content
export function ProfileLikedPostsTab() {
  const { userData, isOwnProfile } = useOutletContext<ProfileContextType>();
  return (
    <ProfileLikedPosts
      likedPosts={userData.likedPosts}
      isOwnProfile={isOwnProfile}
    />
  );
}

// Comments tab content
export function ProfileCommentsTab() {
  const { userData, isOwnProfile } = useOutletContext<ProfileContextType>();
  return (
    <ProfileComments
      comments={userData.comments}
      isOwnProfile={isOwnProfile}
    />
  );
}

// Followers tab content
export function ProfileFollowersTab() {
  const { userData, isOwnProfile } = useOutletContext<ProfileContextType>();
  return (
    <ProfileFollowers
      followers={userData.followers}
      isOwnProfile={isOwnProfile}
    />
  );
}

// Following tab content
export function ProfileFollowingTab() {
  const { userData, isOwnProfile } = useOutletContext<ProfileContextType>();
  return (
    <ProfileFollowing
      following={userData.following}
      isOwnProfile={isOwnProfile}
    />
  );
}
