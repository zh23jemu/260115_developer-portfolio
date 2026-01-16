export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  content: string;
  category: string;
  tags: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

export interface ArticleMetadata {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  cover?: string;
}
