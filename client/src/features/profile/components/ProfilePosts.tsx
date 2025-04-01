import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
}

interface ProfilePostsProps {
  posts: Post[];
  isOwnProfile: boolean;
}

const ProfilePosts = ({ posts, isOwnProfile }: ProfilePostsProps) => {
  return (
    <div className="grid gap-6 py-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ♥ {post.likes} likes
                </span>
                {isOwnProfile ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
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
            ? "You haven't posted anything yet."
            : "This user hasn't posted anything yet."}
        </p>
      )}
    </div>
  );
};

export default ProfilePosts;
