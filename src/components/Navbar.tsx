import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, Music, LayoutDashboard, PlusCircle, Home } from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { motion } from 'motion/react';

interface NavbarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onPageChange, currentPage }) => {
  const { user, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'list', label: '뮤직 스토리', icon: Music },
  ];

  if (isAdmin) {
    navItems.push(
      { id: 'admin', label: '대시보드', icon: LayoutDashboard },
      { id: 'upload', label: '업로드', icon: PlusCircle }
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between">
      <div 
        className="text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2"
        onClick={() => onPageChange('home')}
      >
        <span className="bg-black text-white px-2 py-0.5 rounded">심금</span>
        <span>추억뮤직스토리</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-black",
                currentPage === item.id ? "text-black" : "text-gray-400"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || ''} alt="profile" className="w-8 h-8 rounded-full border border-black/10" />
              <button onClick={handleLogout} className="text-gray-400 hover:text-black transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
            >
              <LogIn size={16} />
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
