import { Github, Linkedin, Mail, Twitter, ExternalLink, Github as GithubIcon } from "lucide-react";

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Mail":
      return Mail;
    case "Github":
      return Github;
    case "Linkedin":
      return Linkedin;
    case "Twitter":
      return Twitter;
    case "ExternalLink":
      return ExternalLink;
    default:
      return GithubIcon;
  }
};
