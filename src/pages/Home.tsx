import { motion } from "framer-motion";
import { FadeIn } from "../components/common/FadeIn";

export const Home = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <FadeIn delay={0.2}>
          <motion.div
            className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-primary p-1"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <span className="text-5xl">👨‍💻</span>
            </div>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary text-transparent bg-clip-text">
            你好，我是开发者
          </h1>
        </FadeIn>

        <FadeIn delay={0.6}>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8">
            全栈开发工程师 | 技术爱好者 | 开源贡献者
          </p>
        </FadeIn>

        <FadeIn delay={0.8}>
          <motion.button
            className="bg-gradient-primary px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "#projects")}
          >
            查看我的作品
          </motion.button>
        </FadeIn>

        <FadeIn delay={1}>
          <motion.div
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-foreground/60 text-sm">向下滚动查看更多</p>
            <div className="mt-2 text-foreground/60">↓</div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};
