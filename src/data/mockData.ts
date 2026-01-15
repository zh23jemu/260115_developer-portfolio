import type { ProjectItem, SkillItem, ContactItem } from "../types";

export const projects: ProjectItem[] = [
  {
    id: "1",
    name: "个人博客系统",
    description: "一个功能完善的个人博客系统，支持 Markdown 编辑、评论功能和文章分类。",
    image: "/images/project-1.jpg",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB"],
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "2",
    name: "在线任务管理",
    description: "团队协作任务管理工具，支持看板视图、任务分配和进度追踪。",
    image: "/images/project-2.jpg",
    techStack: ["Vue 3", "TypeScript", "Firebase", "Tailwind CSS"],
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "3",
    name: "天气预报应用",
    description: "实时天气查询应用，提供 7 天天气预报和空气指数信息。",
    image: "/images/project-3.jpg",
    techStack: ["React Native", "TypeScript", "OpenWeather API"],
    link: "https://example.com",
    github: "https://github.com",
  },
];

export const skills: SkillItem[] = [
  { name: "React", level: "advanced" },
  { name: "TypeScript", level: "advanced" },
  { name: "Vue.js", level: "intermediate" },
  { name: "Node.js", level: "intermediate" },
  { name: "Python", level: "beginner" },
  { name: "Tailwind CSS", level: "advanced" },
  { name: "Git", level: "advanced" },
  { name: "Docker", level: "intermediate" },
];

export const contacts: ContactItem[] = [
  {
    type: "email",
    label: "Email",
    url: "mailto:your.email@example.com",
    icon: "Mail",
  },
  {
    type: "github",
    label: "GitHub",
    url: "https://github.com/yourusername",
    icon: "Github",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/yourprofile",
    icon: "Linkedin",
  },
  {
    type: "twitter",
    label: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: "Twitter",
  },
];
