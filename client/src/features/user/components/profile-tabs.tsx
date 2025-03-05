import { FileText, Heart, User } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  postsCount: number;
  likesCount: number;
  aboutText: string;
}

const ProfileTabs = ({
  activeTab,
  onTabChange,
  postsCount,
  likesCount,
  aboutText,
}: ProfileTabsProps) => {
  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: FileText,
      count: postsCount,
    },
    {
      id: "likes",
      label: "Likes",
      icon: Heart,
      count: likesCount,
    },
    {
      id: "about",
      label: "About",
      icon: User,
      count: null,
    },
  ];

  return (
    <div className="border-b">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
