export const tags = [
  { label: "React", value: "react", bgColor: "#57C4DC", textColor: "#000000" },
  {
    label: "TypeScript",
    value: "typescript",
    bgColor: "#3178C6",
    textColor: "#FFFFFF",
  },
  {
    label: "JavaScript",
    value: "javascript",
    bgColor: "#3077C6",
    textColor: "#FFFFFF",
  },
  { label: "CSS", value: "css", bgColor: "#264DE4", textColor: "#FFFFFF" },
  {
    label: "Node.js",
    value: "nodejs",
  },
  {
    label: "Next.js",
    value: "nextjs",
  },
  {
    label: "Tailwind CSS",
    value: "tailwindcss",
    bgColor: "#06B6D4",
    textColor: "#FFFFFF",
  },
  { label: "Git", value: "git", bgColor: "#F05032", textColor: "#FFFFFF" },
  {
    label: "GitHub",
    value: "github",
  },
  {
    label: "Docker",
    value: "docker",
    bgColor: "#2496ED",
    textColor: "#FFFFFF",
  },
  {
    label: "Kubernetes",
    value: "kubernetes",
  },
  { label: "AWS", value: "aws", bgColor: "#FF9900", textColor: "#000000" },
  { label: "Azure", value: "azure", bgColor: "#0078D4", textColor: "#FFFFFF" },
  { label: "GCP", value: "gcp", bgColor: "#4285F4", textColor: "#FFFFFF" },
  {
    label: "Windows",
    value: "windows",
    bgColor: "#0078D6",
    textColor: "#FFFFFF",
  },
  { label: "PHP", value: "php", bgColor: "#777BB4", textColor: "#FFFFFF" },
  {
    label: "Python",
    value: "python",
    bgColor: "#3776AB",
    textColor: "#FFFFFF",
  },
  { label: "Ruby", value: "ruby", bgColor: "#CC342D", textColor: "#FFFFFF" },
  { label: "Java", value: "java", bgColor: "#007396", textColor: "#FFFFFF" },
  { label: "C#", value: "csharp", bgColor: "#239120", textColor: "#FFFFFF" },
  {
    label: "C++",
    value: "cplusplus",
    bgColor: "#00599C",
    textColor: "#FFFFFF",
  },
] as const;

export const tagsAsStrings = tags.map((tag) => tag.value);
