import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { MediaUpload } from '../components/MediaUpload';
import { motion } from 'motion/react';
import { Send, Palette, Type, ArrowLeft } from 'lucide-react';

interface UploadPageProps {
  onPageChange: (page: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onPageChange }) => {
  const { user, isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
  const [themeColor, setThemeColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">관리자만 접근 가능합니다.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !mediaUrl || !mediaType) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        mediaUrl,
        mediaType,
        themeColor,
        fontFamily,
        authorUid: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert('성공적으로 업로드되었습니다.');
      onPageChange('list');
    } catch (error) {
      console.error('Upload failed', error);
      alert('업로드에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-20 bg-gray-50/30">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onPageChange('home')}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 font-bold text-xs tracking-widest"
        >
          <ArrowLeft size={16} /> BACK TO HOME
        </button>

        <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5">
          <h2 className="text-4xl font-bold tracking-tighter mb-12">새로운 스토리 작성</h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Media Content</label>
              <MediaUpload 
                onUploadComplete={(url, type) => {
                  setMediaUrl(url);
                  setMediaType(type);
                }} 
                onReset={() => {
                  setMediaUrl('');
                  setMediaType(null);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 flex items-center gap-2">
                    <Palette size={12} /> Theme
                  </label>
                  <input 
                    type="color" 
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl p-1 cursor-pointer"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 flex items-center gap-2">
                    <Type size={12} /> Font
                  </label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-4 font-medium"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Monospace</option>
                    <option value="Libre Baskerville">Serif</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Story Content</label>
              <textarea 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="당신의 이야기를 들려주세요..."
                className="w-full bg-gray-50 border-none rounded-3xl px-6 py-6 focus:ring-2 focus:ring-black transition-all font-medium resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-6 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '업로드 중...' : (
                <>
                  스토리 발행하기 <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
