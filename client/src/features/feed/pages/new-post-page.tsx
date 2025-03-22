import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PostForm } from "../components/post-form";
import { CreatePostInput } from "../schemas/post.schema";
export default function NewPostPage() {
  const navigate = useNavigate();

  function onSubmit(values: CreatePostInput) {
    console.log(values);
    // Future implementation: API call to create post
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">New Post</h1>
      <Card>
        <CardContent>
          <PostForm
            onSubmit={onSubmit}
            onCancel={() => navigate("/feed")}
            submitLabel="Create Post"
          />
        </CardContent>
      </Card>
    </div>
  );
}
