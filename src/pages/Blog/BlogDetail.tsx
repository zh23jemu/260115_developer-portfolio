import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag, Share2, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '../../components/blog/MarkdownRenderer';
import { CommentSection } from '../../components/blog/CommentSection';
import { blogService } from '../../services/blogService';
import type { Article } from '../../types/blog';

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      await blogService.initialize();
      const foundArticle = blogService.getArticleBySlug(slug || '');

      if (!foundArticle) {
        navigate('/blog', { replace: true });
        return;
      }

      setArticle(foundArticle);
      setRelatedArticles(blogService.getRelatedArticles(foundArticle, 3));
      setIsLoading(false);
    };

    loadArticle();
  }, [slug, navigate]);

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen pt-20">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* 返回按钮 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回博客列表
        </motion.button>

        {/* 文章头部 */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {article.cover && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 relative">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-semibold bg-purple-600/20 text-purple-400 rounded-full">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-400 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} 分钟阅读</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>作者: {article.author}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
              分享
            </motion.button>
          </div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        <hr className="border-gray-700 mb-8" />

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MarkdownRenderer content={article.content} />
        </motion.div>

        {/* 评论区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CommentSection articleId={article.id} />
        </motion.div>

        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 pt-12 border-t border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              相关文章
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <motion.div
                  key={relatedArticle.id}
                  whileHover={{ y: -4 }}
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedArticle.slug}`)}
                >
                  <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(relatedArticle.publishedAt).toLocaleDateString('zh-CN')}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </article>
    </div>
  );
}
