import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import type { Article } from '../../types/blog';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
        {article.cover && (
          <div className="aspect-video overflow-hidden">
            <motion.img
              src={article.cover}
              alt={article.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 text-xs font-semibold bg-purple-600/20 text-purple-400 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <motion.div
              className="text-purple-400 flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 4 }}
            >
              阅读更多
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
