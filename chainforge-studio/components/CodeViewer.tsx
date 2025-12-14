import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { CHAINFORGE_SOURCE_CODE } from '../constants';

const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CHAINFORGE_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([CHAINFORGE_SOURCE_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chainforge.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Source Code</h2>
          <p className="text-gray-400 text-sm">
            Complete, single-file implementation of ChainForge.
          </p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition-colors border border-gray-700"
          >
            <Download size={14} />
            Download .py
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition-colors shadow-lg shadow-emerald-900/20"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-800 bg-[#0d1117] shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#161b22] border-b border-gray-800 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <span className="ml-4 text-xs font-mono text-gray-500">chainforge.py</span>
        </div>
        <pre className="absolute top-10 bottom-0 left-0 right-0 p-6 overflow-auto text-sm font-mono leading-relaxed text-gray-300">
          <code>{CHAINFORGE_SOURCE_CODE}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
