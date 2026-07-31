import React, { useState } from 'react';
import { CHEATSHEET_COMMANDS } from '../../data/cheatsheets';
import { 
  Code, 
  Search, 
  Copy, 
  Check, 
  Terminal,
  X
} from 'lucide-react';

export const CheatsheetsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filteredCommands = CHEATSHEET_COMMANDS.filter((item) => {
    const matchesSearch = 
      item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (category !== 'all' && item.category !== category) return false;
    return true;
  });

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Title Card */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
          <Code className="w-3.5 h-3.5" />
          <span>Быстрый справочник</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Шпаргалка DevOps Команд (CLI Cheatsheets)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Самые частые и полезные команды для kubectl, docker, linux systemd, terraform и git. Нажмите, чтобы мгновенно скопировать.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск команды по названию или тегам (например: logs, clean, state, network)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'kubectl', 'docker', 'linux', 'terraform'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {filteredCommands.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{item.description}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                {item.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs flex items-center justify-between gap-2 border border-slate-800 overflow-x-auto min-w-0">
              <code className="break-all sm:break-normal truncate flex-1 min-w-0">{item.command}</code>
              <button
                onClick={() => handleCopy(item.command)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors"
                title="Скопировать команду"
              >
                {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
