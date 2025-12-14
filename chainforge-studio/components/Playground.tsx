import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Cpu, Sparkles, Send } from 'lucide-react';
import { simulateChainForgeAgent } from '../services/geminiService';

const Playground: React.FC = () => {
  const [input, setInput] = useState('Build a RAG agent to answer questions about ChainForge.');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const runSimulation = async () => {
    if (!input.trim() || isSimulating) return;

    setIsSimulating(true);
    setLogs(prev => [...prev, `\n> User Input: "${input}"\n> Initializing ChainForge Agent...`]);
    
    // Simulate initial delay for realism
    await new Promise(r => setTimeout(r, 600));

    const result = await simulateChainForgeAgent(input);
    
    // Stream effect for result
    const lines = result.split('\n');
    for (const line of lines) {
      setLogs(prev => [...prev, line]);
      await new Promise(r => setTimeout(r, 100)); // Typewriter effect for lines
    }

    setIsSimulating(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="text-emerald-500" />
            Agent Simulator
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Test ChainForge agent logic. Powered by Gemini (simulated runtime).
          </p>
        </div>
        <button
          onClick={clearLogs}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          title="Clear Console"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex-1 bg-black/80 rounded-xl border border-gray-800 flex flex-col shadow-2xl overflow-hidden font-mono text-sm relative">
        {/* Terminal Header */}
        <div className="h-8 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between">
          <span className="text-gray-500 text-xs">console output</span>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-emerald-500/80 text-xs">online</span>
          </div>
        </div>

        {/* Console Output */}
        <div className="flex-1 overflow-auto p-4 space-y-1">
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
              <Sparkles size={48} className="opacity-20" />
              <p>Ready to simulate. Enter a prompt below.</p>
            </div>
          )}
          {logs.map((log, i) => (
            <div key={i} className={`whitespace-pre-wrap ${log.startsWith('>') ? 'text-emerald-400' : 'text-gray-300'}`}>
              {log}
            </div>
          ))}
          {isSimulating && (
            <div className="text-emerald-500 animate-pulse">_</div>
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
              placeholder="E.g., 'Calculate 25 * 4 then summarize the result'"
              className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
              disabled={isSimulating}
            />
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                isSimulating
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
              }`}
            >
              {isSimulating ? (
                <RotateCcw className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
