import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, User as UserIcon, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const goToProfile = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/profile');
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'mock', label: 'Mock Exam' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    onNavigate('home');
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Student';
  const initials = displayName
    .split(' ')
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg text-gray-900 leading-none">Nicco JAMB</div>
              <div className="text-xs text-gray-500">Practice App</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {initials || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4" /> My Dashboard
                    </button>
                    <button
                      onClick={goToProfile}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" /> My Profile
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => handleNav('signin')}>Sign In</Button>
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" onClick={() => handleNav('subjects')}>
                  Start Practice
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {user && (
              <div className="px-4 py-2 border-b border-gray-100 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {initials || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </div>
              </div>
            )}
            {navItems.map(item => (
              <button key={item.id} onClick={() => handleNav(item.id)} className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={goToProfile}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                My Profile
              </button>
            )}
            <div className="px-4 pt-2 flex gap-2">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleNav('signin')}>Sign In</Button>
                  <Button size="sm" className="flex-1 bg-green-600" onClick={() => handleNav('subjects')}>Practice</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
