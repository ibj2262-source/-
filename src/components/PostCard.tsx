import React from 'react';
import { motion } from 'motion/react';
import { Play, Image as ImageIcon, Music as MusicIcon, Trash2, Edit } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  themeColor?: string;
  fontFamily?: string;
  createdAt: any;
}

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isAdmin, onDelete, onEdit }) => {
  const renderMedia = () => {
    switch (post.mediaType) {
      case 'image':
        return <img src={post.mediaUrl} alt={post.title} className="w-full h-64 object-cover" />;
      case 'video':
        return <video src={post.mediaUrl} controls className="w-full h-64 object-cover" />;
      case 'audio':
        return (
          <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center animate-pulse">
              <MusicIcon size={32} />
            </div>
            <audio src={post.mediaUrl} controls className="w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/5 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
      style={{ fontFamily: post.fontFamily }}
    >
      <div className="relative overflow-hidden">
        {renderMedia()}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit?.(post)}
                className="p-2 bg-white/90 backdrop-blur rounded-full text-black hover:bg-black hover:text-white transition-all"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete?.(post.id)}
                className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            {post.mediaType === 'audio' ? 'Music' : post.mediaType === 'video' ? 'Video' : 'Story'}
          </span>
          <div className="h-px flex-1 bg-black/5" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-black transition-colors" style={{ color: post.themeColor }}>
          {post.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
          {post.content}
        </p>
        
        <div className="mt-6 pt-6 border-t border-black/5 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-mono">
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}
          </span>
          <button className="text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
            READ MORE <Play size={10} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
