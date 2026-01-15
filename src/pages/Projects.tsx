import { motion } from "framer-motion";
import { FadeIn } from "../components/common/FadeIn";
import { projects } from "../data/mockData";
import { ExternalLink, Github } from "lucide-react";

export const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-primary text-transparent bg-clip-text">
            项目展示
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.2}>
              <motion.div
                className="bg-foreground/5 rounded-2xl overflow-hidden border border-foreground/10 group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-48 bg-gradient-primary flex items-center justify-center overflow-hidden">
                  <motion.div
                    className="text-6xl"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    🚀
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-light transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-foreground/70 mb-4 text-sm line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-full bg-primary/20 text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>预览</span>
                    </a>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                      >
                        <Github size={16} />
                        <span>代码</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
