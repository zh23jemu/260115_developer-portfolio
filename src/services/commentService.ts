import { createClient } from '@supabase/supabase-js';
import type { Comment } from '../types/blog';

// Supabase 数据库表类型定义
interface DatabaseComment {
  id: string;
  article_id: string;
  author: string;
  content: string;
  created_at: string;
  parent_id?: string;
}

// Supabase 配置
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

// 初始化 Supabase 客户端
function initializeSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase 未配置，评论功能将使用模拟数据');
    return null;
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

class CommentService {
  // 获取文章的所有评论
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    const client = initializeSupabase();
    if (!client) {
      // 返回模拟数据
      return this.getMockComments(articleId);
    }

    const { data, error } = await client
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取评论失败:', error);
      return [];
    }

    return (data as DatabaseComment[]).map(comment => ({
      id: comment.id,
      articleId: comment.article_id,
      author: comment.author,
      content: comment.content,
      createdAt: comment.created_at,
      parentId: comment.parent_id,
    }));
  }

  // 添加新评论
  async addComment(
    articleId: string,
    author: string,
    content: string,
    parentId?: string
  ): Promise<Comment | null> {
    const client = initializeSupabase();
    if (!client) {
      // 返回模拟评论
      const mockComment: Comment = {
        id: Date.now().toString(),
        articleId,
        author,
        content,
        createdAt: new Date().toISOString(),
        parentId,
      };
      return mockComment;
    }

    const newComment = {
      article_id: articleId,
      author,
      content,
      parent_id: parentId,
    };

    const { data, error } = await (client as any)
      .from('comments')
      .insert(newComment)
      .select()
      .single();

    if (error) {
      console.error('添加评论失败:', error);
      return null;
    }

    return {
      id: (data as DatabaseComment).id,
      articleId: (data as DatabaseComment).article_id,
      author: (data as DatabaseComment).author,
      content: (data as DatabaseComment).content,
      createdAt: (data as DatabaseComment).created_at,
      parentId: (data as DatabaseComment).parent_id,
    };
  }

  // 删除评论
  async deleteComment(commentId: string): Promise<boolean> {
    const client = initializeSupabase();
    if (!client) {
      return true;
    }

    const { error } = await client
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('删除评论失败:', error);
      return false;
    }

    return true;
  }

  // 模拟评论数据（用于开发环境）
  private getMockComments(articleId: string): Comment[] {
    return [
      {
        id: '1',
        articleId,
        author: '张三',
        content: '这篇文章写得很好，学到了很多新知识！',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        articleId,
        author: '李四',
        content: '能否详细解释一下并发渲染的具体实现原理？',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  // 检查 Supabase 是否已配置
  isConfigured(): boolean {
    return !!(supabaseUrl && supabaseKey);
  }
}

// 导出单例实例
export const commentService = new CommentService();
