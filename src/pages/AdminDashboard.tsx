import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Trash2, Edit, Settings, Layout, Users, FileText, BarChart } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, images: 0, videos: 0, audio: 0 });
  const { isAdmin } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPosts(p);
      
      const s = { total: p.length, images: 0, videos: 0, audio: 0 };
      p.forEach(post => {
        if (post.mediaType === 'image') s.images++;
        if (post.mediaType === 'video') s.videos++;
        if (post.mediaType === 'audio') s.audio++;
      });
      setStats(s);
    });
    return unsubscribe;
  }, []);

  if (!isAdmin) return null;

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-20 bg-gray-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-bold tracking-tighter">관리자 대시보드</h2>
          <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            <Settings size={14} /> Admin Mode
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: '전체 게시물', value: stats.total, icon: FileText, color: 'bg-black' },
            { label: '이미지', value: stats.images, icon: Layout, color: 'bg-blue-500' },
            { label: '비디오', value: stats.videos, icon: BarChart, color: 'bg-purple-500' },
            { label: '오디오', value: stats.audio, icon: Users, color: 'bg-green-500' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4", stat.color)}>
                <stat.icon size={20} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Management Table */}
        <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
          <div className="p-8 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-xl font-bold">콘텐츠 관리</h3>
            <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  <th className="px-8 py-4">Media</th>
                  <th className="px-8 py-4">Title</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {posts.map((post) => (
                  <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/5">
                        {post.mediaType === 'image' ? (
                          <img src={post.mediaUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center text-white">
                            <FileText size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-sm">{post.title}</td>
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 bg-black/5 rounded text-[10px] font-bold uppercase tracking-widest">
                        {post.mediaType}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs text-gray-400 font-mono">
                      {post.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-black hover:text-white rounded-full transition-all">
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
