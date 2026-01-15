export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
  github?: string;
}

export interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface ContactItem {
  type: "email" | "github" | "linkedin" | "twitter";
  label: string;
  url: string;
  icon: string;
}
