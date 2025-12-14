import React from 'react';
import { View } from '../types';
import { Terminal, Code2, Play, BookOpen, Menu, Github } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Overview', icon: <Terminal size={18} /> },
    { id: 'source', label: 'Source Code', icon: <Code2 size={18} /> },
    { id: 'playground', label: 'Live Simulator', icon: <Play size={18} /> },
    { id: 'docs', label: 'Documentation', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-300 font-sans selection:bg-emerald-500/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-8 h-8 bg-emerald-500/20 rounded flex items-center justify-center border border-emerald-500/50">
              <span className="font-bold text-lg">CF</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">ChainForge</h1>
          </div>
          <p className="text-xs text-gray-500 mt-2">v0.1.0-alpha</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className={currentView === item.id ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <a
            href="#"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <Github size={14} />
            github.com/chainforge
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
          <div className="flex items-center gap-2 text-emerald-400">
             <div className="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center border border-emerald-500/50">
              <span className="font-bold text-xs">CF</span>
            </div>
            <span className="font-bold text-white">ChainForge</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-50 bg-gray-900/95 p-4 md:hidden">
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 p-2">
                Close
              </button>
            </div>
            <nav className="space-y-2">
               {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg bg-gray-800/50 text-white"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-auto bg-gray-950 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
