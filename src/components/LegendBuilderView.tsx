import React, { useState } from 'react';
import { ExperienceLegend } from '../types';
import { LEGEND_TEMPLATES, LEGEND_RULES } from '../data/legendGuide';
import { 
  Award, 
  Sparkles, 
  Copy, 
  Check, 
  Save
} from 'lucide-react';

interface LegendBuilderViewProps {
  savedLegend?: ExperienceLegend;
  onSaveLegend: (legend: ExperienceLegend) => void;
}

export const LegendBuilderView: React.FC<LegendBuilderViewProps> = ({
  savedLegend,
  onSaveLegend
}) => {
  const [company, setCompany] = useState(savedLegend?.companyName || 'FinTech Core Platform');
  const [role, setRole] = useState(savedLegend?.roleTitle || 'DevOps / Infrastructure Engineer');
  const [projectType, setProjectType] = useState(savedLegend?.projectType || 'Высоконагруженная банковская система');
  const [stack, setStack] = useState(savedLegend?.stack?.join(', ') || 'Kubernetes, Docker, Terraform, GitLab CI, ArgoCD, Prometheus, Grafana, PostgreSQL');
  const [architecture, setArchitecture] = useState(savedLegend?.architectureSummary || 'Микросервисная архитектура (200+ сервисов) в 3 ЦОД. GitOps подход через ArgoCD и Helm чарты.');
  const [incidentStory, setIncidentStory] = useState(savedLegend?.incidentStory || 'Во время пика распродажи у одного из подов базы данных PGBouncer исчерпался лимит соединений. Обычный рестарт не помогал. Я зашел через kubectl debug, обнаружил утечку сокетов, скорректировал max_connections и добавил HPA авто-масштабирование.');
  const [metrics, setMetrics] = useState(savedLegend?.metrics?.join('\n') || '- Уменьшил время сборки CI/CD с 25 до 4 минут\n- Поднял SLA сервиса до 99.98%\n- Сократил расходы на облако на 30% через Spot-инстанции');
  
  const [copied, setCopied] = useState(false);

  // Load Template
  const handleApplyTemplate = (tplId: string) => {
    const tpl = LEGEND_TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    setCompany(tpl.title);
    setRole(tpl.role);
    setProjectType(tpl.companyType);
    setStack(tpl.stack.join(', '));
    setArchitecture(tpl.architecture);
    setIncidentStory(tpl.incidentStory);
    setMetrics(tpl.metrics.join('\n'));
  };

  const handleSaveAction = () => {
    const newLegend: ExperienceLegend = {
      id: savedLegend?.id || Date.now().toString(),
      companyName: company,
      roleTitle: role,
      projectType,
      teamSize: '4 человека',
      stack: stack.split(',').map(s => s.trim()),
      architectureSummary: architecture,
      cicdProcess: 'GitLab CI + ArgoCD',
      monitoringSetup: 'Prometheus + Grafana',
      incidentStory,
      metrics: metrics.split('\n').filter(Boolean),
      updatedAt: new Date().toLocaleDateString('ru-RU')
    };

    onSaveLegend(newLegend);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      
      {/* Page Title Card */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
          <Award className="w-3.5 h-3.5" />
          <span>Карьерный Модуль</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Конструктор "Легенды Опыта" (Work Experience Story)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          На техническом собеседовании главный вопрос от Tech Lead — "Расскажите про свой последний проект, стек и факапы". 
          Сконструируйте правдоподобную, технически выверенную историю вашего коммерческого опыта.
        </p>
      </div>

      {/* Guide Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LEGEND_RULES.map((r, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#121927]/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">{r.step}</div>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.rule}</div>
          </div>
        ))}
      </div>

      {/* Templates Selector */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Быстрые шаблоны легенд:
        </div>
        <div className="flex flex-wrap gap-2">
          {LEGEND_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleApplyTemplate(tpl.id)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{tpl.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Form */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Название компании / проекта:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ваша роль в команде:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Стек технологий (через запятую):</label>
          <input
            type="text"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Архитектура и задачи (Что было под капотом):</label>
          <textarea
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Разбор аварии / Факапа (STAR метод):</label>
          <textarea
            value={incidentStory}
            onChange={(e) => setIncidentStory(e.target.value)}
            rows={3}
            placeholder="Опишите ситуацию, проблему в Prod и как вы ее локализовали..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Метрики и измеримые результаты (по 1 на строку):</label>
          <textarea
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSaveAction}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{copied ? 'Сохранено!' : 'Сохранить легенду опыта'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
