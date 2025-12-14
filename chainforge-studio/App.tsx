import React, { useState } from 'react';
import Layout from './components/Layout';
import CodeViewer from './components/CodeViewer';
import Playground from './components/Playground';
import Docs from './components/Docs';
import { View } from './types';
import { ArrowRight, Terminal } from 'lucide-react';

const Home: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-8 animate-fade-in">
      <Terminal size={40} className="text-emerald-400" />
    </div>
    
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
      Build AI Chains <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        In Pure Python
      </span>
    </h1>
    
    <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
      ChainForge is a lightweight, type-safe, and asynchronous framework for building LLM applications. 
      Designed for production with Pydantic and Asyncio.
    </p>

    <div className="flex gap-4">
      <button
        onClick={onStart}
        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 group"
      >
        Get the Code
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
      <button
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all border border-gray-700"
      >
        Learn More
      </button>
    </div>
    
    <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <h3 className="font-bold text-white text-lg mb-2">Type-Safe</h3>
            <p className="text-gray-400">Built on Pydantic and Python 3.12+ type hints for robust developer experience.</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <h3 className="font-bold text-white text-lg mb-2">Async Native</h3>
            <p className="text-gray-400">Built from the ground up with <code>asyncio</code> for high-performance concurrent chains.</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <h3 className="font-bold text-white text-lg mb-2">Zero Fluff</h3>
            <p className="text-gray-400">Minimal abstractions. Single file drop-in or pip installable package.</p>
        </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onStart={() => setCurrentView('source')} />;
      case 'source':
        return <CodeViewer />;
      case 'playground':
        return <Playground />;
      case 'docs':
        return <Docs />;
      default:
        return <Home onStart={() => setCurrentView('source')} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
