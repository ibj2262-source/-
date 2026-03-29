import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { MusicList } from './pages/MusicList';
import { UploadPage } from './pages/UploadPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />;
      case 'list':
        return <MusicList />;
      case 'upload':
        return <UploadPage onPageChange={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
        <Navbar onPageChange={setCurrentPage} currentPage={currentPage} />
        
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="bg-white border-t border-black/5 py-12 px-6 md:px-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold tracking-tighter mb-2">심금의 추억뮤직스토리</h4>
              <p className="text-xs text-gray-400">© 2026 Memory Music Story. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-8">
              {['Instagram', 'Youtube', 'Soundcloud'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
