import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
  id: string;
  username: string;
  profileImageUrl?: string;
}

interface LikedPost {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: Date;
  likes: number;
}

interface ProfileLikedPostsProps {
  likedPosts: LikedPost[];
  isOwnProfile: boolean;
}

const ProfileLikedPosts = ({
  likedPosts,
  isOwnProfile,
}: ProfileLikedPostsProps) => {
  return (
    <div className="grid gap-6 py-6">
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={post.author.profileImageUrl}
                        alt={post.author.username}
                      />
                      <AvatarFallback>{post.author.username[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground">
                      @{post.author.username} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Liked</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ♥ {post.likes} likes
                </span>
                {isOwnProfile ? (
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    Unlike
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    View Post
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">
          {isOwnProfile
            ? "You haven't liked any posts yet."
            : "This user hasn't liked any posts yet."}
        </p>
      )}
    </div>
  );
};

export default ProfileLikedPosts;
