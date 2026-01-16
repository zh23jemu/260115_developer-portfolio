import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { Comment } from '../../types/blog';

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // 加载评论
  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await commentService.getCommentsByArticle(articleId);
        setComments(fetchedComments);
        setIsSupabaseConfigured(commentService.isConfigured());
      } catch (error) {
        console.error('加载评论失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) return;

    setIsSubmitting(true);

    try {
      const addedComment = await commentService.addComment(
        articleId,
        newComment.author.trim(),
        newComment.content.trim()
      );

      if (addedComment) {
        setComments([...comments, addedComment]);
        setNewComment({ author: '', content: '' });
      } else {
        console.error('添加评论失败');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const success = await commentService.deleteComment(commentId);
      if (success) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('删除评论失败:', error);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-purple-400" />
        评论 ({comments.length})
      </h3>

      {/* 提示信息 */}
      {!isSupabaseConfigured && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-300">
            ⚠️ 评论功能未配置数据库连接，评论仅保存在本地。
          </p>
        </div>
      )}

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="你的昵称"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              评论内容
            </label>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="分享你的想法..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? '提交中...' : '发表评论'}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-white">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('zh-CN')} {new Date(comment.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{comment.content}</p>
              </div>
              {isSupabaseConfigured && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                >
                  删除
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">还没有评论，快来发表第一条吧！</p>
        </div>
      )}
    </div>
  );
}
