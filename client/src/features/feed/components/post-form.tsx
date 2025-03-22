import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreatePostInput, createPostSchema } from "../schemas/post.schema";
import { MultiSelect } from "@/components/ui/multi-select";
import { tags } from "../../../../../shared/constants/tags.constants";
import { POST_STATUS } from "../../../../../shared/constants/posts.constants";
import { Loader2 } from "lucide-react";
interface PostFormProps {
  defaultValues?: Partial<CreatePostInput>;
  onSubmit: (values: CreatePostInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function PostForm({
  onSubmit,
  onCancel,
  submitLabel = "Create Post",
  isLoading = false,
}: PostFormProps) {
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      status: POST_STATUS.PUBLISHED,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="content">Content</FormLabel>
              <FormControl>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tags.map((tag) => ({
                    label: tag.label,
                    value: tag.value,
                  }))}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                  placeholder="Select tags"
                  variant="inverted"
                  maxCount={3}
                  className="h-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
