import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostAuthor {
  id: string;
  username: string;
  profileImageUrl?: string;
}

interface Post {
  id: string;
  title: string;
  author: PostAuthor;
}

interface Comment {
  id: string;
  content: string;
  post: Post;
  createdAt: Date;
}

interface ProfileCommentsProps {
  comments: Comment[];
  isOwnProfile: boolean;
}

const ProfileComments = ({ comments, isOwnProfile }: ProfileCommentsProps) => {
  return (
    <div className="grid gap-6 py-6">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <CardTitle className="text-base">
                Comment on{" "}
                <span className="font-semibold">{comment.post.title}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={comment.post.author.profileImageUrl}
                    alt={comment.post.author.username}
                  />
                  <AvatarFallback>
                    {comment.post.author.username[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  Post by @{comment.post.author.username} •{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-l-4 pl-3 py-2 mb-3 border-muted">
                <p className="text-sm italic">"{comment.content}"</p>
              </div>
              <div className="flex justify-end gap-2">
                {isOwnProfile ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      Edit Comment
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                    >
                      View Post
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    View Discussion
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">
          {isOwnProfile
            ? "You haven't commented on any posts yet."
            : "This user hasn't commented on any posts yet."}
        </p>
      )}
    </div>
  );
};

export default ProfileComments;
