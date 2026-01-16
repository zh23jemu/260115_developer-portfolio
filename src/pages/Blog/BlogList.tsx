import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from '../../components/blog/ArticleCard';
import { SearchBar } from '../../components/blog/SearchBar';
import { CategoryFilter } from '../../components/blog/CategoryFilter';
import { blogService } from '../../services/blogService';
import type { Article } from '../../types/blog';

export function BlogList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('BlogList useEffect triggered');
    const loadArticles = async () => {
      console.log('Starting to load articles...');
      try {
        await blogService.initialize();
        const allArticles = blogService.getAllArticles();
        console.log('Articles loaded:', allArticles);
        console.log('Article count:', allArticles.length);
        setArticles(allArticles);
        setFilteredArticles(allArticles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading articles:', error);
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 分类筛选
  useEffect(() => {
    let result = articles;

    // 先按分类筛选
    if (selectedCategory !== '全部') {
      result = blogService.getArticlesByCategory(selectedCategory);
    }

    // 再按搜索词筛选
    if (searchQuery.trim()) {
      result = blogService.searchArticles(searchQuery).filter(article =>
        selectedCategory === '全部' || article.category === selectedCategory
      );
    }

    setFilteredArticles(result);
  }, [selectedCategory, searchQuery, articles]);

  const categories = ['全部', ...blogService.getAllCategories()];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            技术博客
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            分享技术见解，记录学习历程，探索编程世界的无限可能
          </p>
        </div>
      </motion.section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">没有找到相关文章</h3>
            <p className="text-gray-400">试试其他关键词或分类</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                共 <span className="text-purple-400 font-semibold">{filteredArticles.length}</span> 篇文章
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  清除搜索
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard
                    article={article}
                    onClick={() => navigate(`/blog/${article.slug}`)}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
