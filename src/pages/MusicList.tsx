import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Search, Filter, Loader2 } from 'lucide-react';

export const MusicList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(p);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.mediaType === filter;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-20 bg-gray-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2 block">Archive</span>
            <h2 className="text-5xl font-bold tracking-tighter">뮤직 스토리 리스트</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white border border-black/5 p-1 rounded-full shadow-sm">
              {['all', 'image', 'video', 'audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest",
                    filter === type ? "bg-black text-white shadow-lg" : "text-gray-400 hover:text-black"
                  )}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-black" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                isAdmin={isAdmin} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-400 font-medium">아직 등록된 스토리가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
