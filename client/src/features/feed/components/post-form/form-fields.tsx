import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { tags } from "../../../../../../shared/constants/tags.constants";
import { CreatePostInput } from "../../schemas/post.schema";
import { useTheme } from "@/providers/theme-provider";

interface FormFieldsProps {
  control: Control<CreatePostInput>;
}

export const FormFields = ({ control }: FormFieldsProps) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <FormField
        control={control}
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
        control={control}
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
            <FormControl>
              <Input
                id="subtitle"
                placeholder="Enter post subtitle (optional)"
                className="w-full"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="tags">Tags</FormLabel>
            <FormControl>
              <MultiSelect
                options={tags.map((tag) => ({
                  label: tag.label,
                  value: tag.value,
                  bgColor:
                    "bgColor" in tag
                      ? tag.bgColor
                      : isDarkMode
                        ? "#FFFFFF"
                        : "#000000",
                  textColor:
                    "textColor" in tag
                      ? tag.textColor
                      : isDarkMode
                        ? "#000000"
                        : "#FFFFFF",
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
    </>
  );
};
