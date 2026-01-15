import { motion } from "framer-motion";
import { FadeIn } from "../components/common/FadeIn";
import { skills } from "../data/mockData";

const skillLevelColors = {
  beginner: "bg-yellow-500",
  intermediate: "bg-blue-500",
  advanced: "bg-green-500",
};

export const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-primary text-transparent bg-clip-text">
            关于我
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="space-y-6">
              <p className="text-lg text-foreground/80 leading-relaxed">
                我是一名充满热情的全栈开发工程师，拥有多年的软件开发经验。我热爱技术，追求卓越，
                专注于构建高质量、用户友好的 Web 应用程序。
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                我擅长使用现代前端技术栈，包括 React、Vue.js、TypeScript 等，同时也熟悉后端开发，
                能够独立完成从设计到部署的完整项目流程。
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                除了编程，我还热衷于开源项目和技术分享，相信技术能够改变世界。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-foreground/5 rounded-2xl p-8 border border-foreground/10">
              <h3 className="text-2xl font-semibold mb-6">技能栈</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill.name}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-foreground/10 border border-foreground/20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="w-2 h-2 rounded-full {skillLevelColors[skill.level]}" />
                    <span className="font-medium">{skill.name}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
