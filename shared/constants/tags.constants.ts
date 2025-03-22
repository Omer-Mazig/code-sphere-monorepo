export const tags = [
  { label: "React", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "CSS", value: "css" },
  { label: "Node.js", value: "nodejs" },
  { label: "Next.js", value: "nextjs" },
  { label: "Tailwind CSS", value: "tailwindcss" },
  { label: "Git", value: "git" },
  { label: "GitHub", value: "github" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "GCP", value: "gcp" },
  { label: "Linux", value: "linux" },
  { label: "MacOS", value: "macos" },
  { label: "Windows", value: "windows" },
  { label: "PHP", value: "php" },
  { label: "Python", value: "python" },
  { label: "Ruby", value: "ruby" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cplusplus" },
] as const;

export const tagsAsStrings = tags.map((tag) => tag.value);

export type TagAsStrings = (typeof tagsAsStrings)[number];
export type Tag = (typeof tags)[number];
