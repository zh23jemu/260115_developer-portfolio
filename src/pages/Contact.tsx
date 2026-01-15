import { motion } from "framer-motion";
import { FadeIn } from "../components/common/FadeIn";
import { contacts } from "../data/mockData";
import { getIcon } from "../utils/icons";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-primary text-transparent bg-clip-text">
            联系方式
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg text-foreground/80 text-center mb-12">
            无论是项目合作、技术交流，还是简单的打个招呼，都欢迎随时联系我！
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {contacts.map((contact, index) => {
            const Icon = getIcon(contact.icon);
            return (
              <FadeIn key={contact.type} delay={0.3 + index * 0.1}>
                <motion.a
                  href={contact.url}
                  target={contact.type === "email" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10 flex flex-col items-center justify-center space-y-4 hover:bg-gradient-primary transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="p-4 rounded-full bg-primary/20 group-hover:bg-white/20 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={32} className="text-primary-light group-hover:text-white" />
                  </motion.div>
                  <span className="text-foreground/80 font-medium group-hover:text-white transition-colors">
                    {contact.label}
                  </span>
                </motion.a>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.7}>
          <motion.div className="mt-16 text-center" whileHover={{ scale: 1.02 }}>
            <p className="text-foreground/60">感谢您的访问，期待与您的交流！</p>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};
