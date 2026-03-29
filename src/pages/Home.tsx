import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, Music, Video, Image as ImageIcon } from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 md:px-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://ais-dev-bcqeft7bhx746olrxcqxfu-271743826715.asia-east1.run.app/src/assets/hero-bg.jpg" 
            alt="background" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              // Fallback if the image doesn't exist at the specific path
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/music/1920/1080?blur=2";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase mb-6 rounded">
              Memory Music Story
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              심금의<br />
              <span className="text-gray-300">추억뮤직</span><br />
              스토리
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
              당신의 소중한 순간들을 선율과 영상으로 기록합니다. 
              일상의 조각들이 모여 하나의 아름다운 이야기가 되는 곳.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onPageChange('list')}
                className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black/80 transition-all group"
              >
                스토리 보기 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-black/10 px-8 py-4 rounded-full font-bold hover:bg-black/5 transition-all">
                소개 더보기
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute right-20 bottom-20 hidden lg:flex flex-col gap-4">
          {[
            { icon: Music, label: 'Music' },
            { icon: Video, label: 'Video' },
            { icon: ImageIcon, label: 'Story' }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 bg-white/50 backdrop-blur-xl border border-black/5 p-4 rounded-2xl shadow-xl shadow-black/5"
            >
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-20 px-6 md:px-20 bg-black text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-4xl font-bold mb-4">01</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              고해상도 영상과 무손실 음원을 통해 당신의 추억을 가장 선명하게 보관합니다.
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-4">02</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              개별 게시물마다 테마 색상과 폰트를 커스터마이징하여 감성을 더할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-4">03</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              모바일과 PC 어디서든 최적화된 환경에서 당신의 스토리를 감상하세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
