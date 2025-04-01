import { Link, useLocation } from "react-router-dom";

interface ProfileTabsProps {
  baseUrl: string;
  isOwnProfile: boolean;
}

const ProfileTabs = ({ baseUrl, isOwnProfile }: ProfileTabsProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getTabClass = (path: string) => {
    const isActive =
      currentPath === path ||
      (path.endsWith("/posts") && currentPath === baseUrl);

    return `px-4 py-2 font-medium text-sm ${
      isActive
        ? "border-b-2 border-primary text-primary"
        : "text-muted-foreground hover:text-foreground transition-colors"
    }`;
  };

  return (
    <div className="border-b w-full overflow-x-auto">
      <div className="flex space-x-2">
        <Link
          to={`${baseUrl}/posts`}
          className={getTabClass(`${baseUrl}/posts`)}
        >
          Posts
        </Link>
        <Link
          to={`${baseUrl}/liked`}
          className={getTabClass(`${baseUrl}/liked`)}
        >
          Liked Posts
        </Link>
        <Link
          to={`${baseUrl}/comments`}
          className={getTabClass(`${baseUrl}/comments`)}
        >
          Comments
        </Link>
        <Link
          to={`${baseUrl}/followers`}
          className={getTabClass(`${baseUrl}/followers`)}
        >
          Followers
        </Link>
        <Link
          to={`${baseUrl}/following`}
          className={getTabClass(`${baseUrl}/following`)}
        >
          Following
        </Link>
      </div>
    </div>
  );
};

export default ProfileTabs;
