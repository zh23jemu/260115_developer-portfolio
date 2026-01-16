import type { Article, ArticleMetadata } from '../types/blog';

// Markdown文章列表（实际项目中这些文件应该从 data/articles 目录导入）
// 使用类型断言来处理 Markdown 文件导入
const articleFiles: Record<string, () => Promise<any>> = {
  'react-best-practices': () =>
    import('../data/articles/react-best-practices.md?raw').then(m => {
      console.log('Loading react-best-practices:', typeof m.default);
      return m.default;
    }),
  'typescript-advanced': () =>
    import('../data/articles/typescript-advanced.md?raw').then(m => {
      console.log('Loading typescript-advanced:', typeof m.default);
      return m.default;
    }),
};

// 解析 Markdown 文件的前置元数据
function parseMetadata(markdown: string): ArticleMetadata | null {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match || !match[1]) {
    console.log('No metadata found in markdown');
    return null;
  }

  const metadata = match[1];
  console.log('Raw metadata string:', metadata);
  const data: Record<string, any> = {};

  metadata.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let valueParts = line.slice(colonIndex + 1).trim();
    
    console.log(`Parsing line: key="${key}", value="${valueParts}"`);
    
    // 跳过空值
    if (!valueParts) return;
    
    // 处理数组类型的值（如 tags）
    if (valueParts.startsWith('[') && valueParts.endsWith(']')) {
      const arrayValue = valueParts.slice(1, -1);
      data[key] = arrayValue.split(',').map((item: string) => {
        // 移除每个元素周围的引号和空格
        const trimmed = item.trim();
        return trimmed.replace(/^["']|["']$/g, '');
      });
    } else {
      // 移除普通值周围的引号（支持单引号、双引号或无引号）
      valueParts = valueParts.replace(/^["']|["']$/g, '');
      if (key) {
        data[key] = valueParts;
      }
    }
  });

  console.log('Parsed metadata:', data);
  
  // 验证必需字段
  if (!data.title || !data.excerpt || !data.author || !data.category || !data.publishedAt) {
    console.error('Missing required fields:', data);
    return null;
  }
  
  return data as ArticleMetadata;
}

// 移除 Markdown 的前置元数据
function removeMetadata(markdown: string): string {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

// 计算阅读时长（中文按200字/分钟，英文按200词/分钟）
function calculateReadingTime(content: string): number {
  const text = content.replace(/[#*_`~\[\]()]/g, '');
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return Math.ceil((chineseChars / 200) + (englishWords / 200)) || 1;
}

class BlogService {
  private articles: Article[] = [];
  private initialized = false;

  // 初始化：加载所有文章
  async initialize() {
    if (this.initialized) {
      console.log('BlogService already initialized');
      return;
    }

    console.log('Starting to load articles...');

    const articlePromises = Object.entries(articleFiles).map(async ([slug, loadFile]) => {
      try {
        console.log(`Loading article: ${slug}`);
        const markdown = await loadFile();
        console.log(`Article ${slug} loaded, length: ${markdown?.length}`);
        const metadata = parseMetadata(markdown);
        console.log(`Article ${slug} metadata:`, metadata);
        if (!metadata) {
          console.error(`Failed to parse metadata for ${slug}`);
          return null;
        }

        const content = removeMetadata(markdown);
        const readingTime = calculateReadingTime(content);

        const article = {
          id: slug,
          slug,
          title: metadata.title,
          excerpt: metadata.excerpt,
          cover: metadata.cover,
          author: metadata.author,
          publishedAt: metadata.publishedAt,
          readingTime,
          content,
          category: metadata.category,
          tags: metadata.tags,
        } as Article;

        console.log(`Article ${slug} successfully created`);
        return article;
      } catch (error) {
        console.error(`Error loading article ${slug}:`, error);
        return null;
      }
    });

    const loadedArticles = await Promise.all(articlePromises);
    this.articles = loadedArticles.filter((article): article is Article => article !== null);
    this.initialized = true;

    console.log(`Total articles loaded: ${this.articles.length}`);
    console.log('Article slugs:', this.articles.map(a => a.slug));
  }

  // 获取所有文章（按发布时间倒序）
  getAllArticles(): Article[] {
    return [...this.articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // 根据slug获取文章
  getArticleBySlug(slug: string): Article | null {
    return this.articles.find(article => article.slug === slug) || null;
  }

  // 按分类获取文章
  getArticlesByCategory(category: string): Article[] {
    if (category === '全部') return this.getAllArticles();
    return this.getAllArticles().filter(article => article.category === category);
  }

  // 按标签获取文章
  getArticlesByTag(tag: string): Article[] {
    return this.getAllArticles().filter(article =>
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // 搜索文章
  searchArticles(query: string): Article[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllArticles().filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      article.category.toLowerCase().includes(lowerQuery)
    );
  }

  // 获取所有分类
  getAllCategories(): string[] {
    const categories = this.articles.map(article => article.category);
    return Array.from(new Set(categories));
  }

  // 获取所有标签
  getAllTags(): string[] {
    const tags = this.articles.flatMap(article => article.tags);
    return Array.from(new Set(tags));
  }

  // 获取相关文章（相同分类或标签）
  getRelatedArticles(currentArticle: Article, limit: number = 3): Article[] {
    return this.getAllArticles()
      .filter(
        article =>
          article.id !== currentArticle.id &&
          (article.category === currentArticle.category ||
            article.tags.some(tag => currentArticle.tags.includes(tag)))
      )
      .slice(0, limit);
  }
}

// 导出单例实例
export const blogService = new BlogService();
