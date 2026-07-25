import React, { useState } from 'react';
import { CategoryId, Question, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  Terminal, 
  Globe, 
  Box, 
  GitBranch, 
  Layers, 
  Cpu, 
  Activity, 
  Cloud, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Compass, 
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface RoadmapStage {
  step: number;
  categoryId: CategoryId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  topics: string[];
  keyTools: string[];
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    step: 1,
    categoryId: 'linux',
    title: 'Linux & System Internals',
    subtitle: 'База системы, процессы, память и сеть',
    icon: Terminal,
    color: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    topics: ['Systemd & Инициализация', 'Процессы & Сигналы', 'Cgroups & Namespaces', 'Память, Swap & OOM Killer', 'Права доступа & SSH'],
    keyTools: ['journalctl', 'lsof', 'htop', 'systemctl', 'strace']
  },
  {
    step: 2,
    categoryId: 'networking',
    title: 'Сети & Безопасность',
    subtitle: 'Стек TCP/IP, DNS, TLS, IPTables и балансировка',
    icon: Globe,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    topics: ['Модель OSI & TCP/UDP', 'DNS Резолвинг & Записи', 'TLS/SSL Хэндшейк & Сертификаты', 'Nginx & Reverse Proxy', 'Netfilter & IPTables'],
    keyTools: ['dig', 'tcpdump', 'curl', 'netstat', 'iptables']
  },
  {
    step: 3,
    categoryId: 'docker',
    title: 'Docker & Контейнеризация',
    subtitle: 'Изоляция, слои, Multi-stage и оптимизация образов',
    icon: Box,
    color: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    topics: ['Docker Engine & Architecture', 'Dockerfile Best Practices', 'Multi-stage Builds', 'Docker Networking & Volumes', 'Container Runtimes (containerd)'],
    keyTools: ['docker', 'docker-compose', 'hadolint', 'crictl']
  },
  {
    step: 4,
    categoryId: 'cicd',
    title: 'CI/CD & GitOps',
    subtitle: 'Автоматизация сборок, релизов и ArgoCD',
    icon: GitBranch,
    color: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    topics: ['GitLab CI Pipelines', 'GitHub Actions Workflows', 'Стратегии Canary / Blue-Green', 'GitOps & ArgoCD Sync', 'Helm Packaging'],
    keyTools: ['GitLab CI', 'GitHub Actions', 'ArgoCD', 'Helm']
  },
  {
    step: 5,
    categoryId: 'k8s',
    title: 'Kubernetes & Оркестрация',
    subtitle: 'Control Plane, Pods, Ingress, CNI и масштабирование',
    icon: Layers,
    color: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
    bgLight: 'bg-sky-50 dark:bg-sky-950/30',
    topics: ['Architecture & Etcd', 'Pods, Deployments, StatefulSets', 'Services & Ingress Controllers', 'CNI, RBAC, NetworkPolicies', 'Autoscaling (HPA, VPA, Karpenter)'],
    keyTools: ['kubectl', 'k9s', 'helm', 'kustomize']
  },
  {
    step: 6,
    categoryId: 'terraform',
    title: 'Infrastructure as Code (IaC)',
    subtitle: 'Декларативное управление инфраструктурой',
    icon: Cpu,
    color: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    topics: ['Terraform State & Locking', 'Modules & Workspaces', 'Drift Detection', 'Ansible Playbooks & Roles', 'Terragrunt DRY Configs'],
    keyTools: ['terraform', 'terragrunt', 'ansible', 'packer']
  },
  {
    step: 7,
    categoryId: 'monitoring',
    title: 'Observability & Мониторинг',
    subtitle: 'Метрики, логи, трейсинг и алертинг',
    icon: Activity,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    topics: ['Prometheus Metrics & PromQL', 'Grafana Dashboards', 'Alertmanager Rules', 'Loki & Vector Logging', 'OpenTelemetry & Tracing'],
    keyTools: ['Prometheus', 'Grafana', 'Alertmanager', 'Vector']
  },
  {
    step: 8,
    categoryId: 'cloud',
    title: 'Облака & System Design',
    subtitle: 'Отказоустойчивость, S3, IAM и Архитектура HA',
    icon: Cloud,
    color: 'text-teal-500 border-teal-500/30 bg-teal-500/10',
    bgLight: 'bg-teal-50 dark:bg-teal-950/30',
    topics: ['High Availability (HA) Design', 'S3 Storage & IAM Roles', 'Managed K8s & Databases', 'Disaster Recovery (RTO/RPO)', 'Cost Optimization (FinOps)'],
    keyTools: ['AWS / Yandex Cloud', 'S3', 'Vault', 'Load Balancers']
  }
];

interface DevOpsRoadmapProps {
  questions: Question[];
  progress: UserProgress;
  onNavigate: (tab: any, filterCategory?: CategoryId) => void;
}

export const DevOpsRoadmap: React.FC<DevOpsRoadmapProps> = ({
  questions,
  progress,
  onNavigate,
}) => {
  const [activeStageId, setActiveStageId] = useState<CategoryId>('linux');

  // Calculate progress for each stage
  const getStageStats = (catId: CategoryId) => {
    const catQuestions = questions.filter(q => q.category === catId);
    const total = catQuestions.length;
    const mastered = catQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { mastered, total, percent };
  };

  const activeStage = ROADMAP_STAGES.find(s => s.categoryId === activeStageId) || ROADMAP_STAGES[0];
  const activeStats = getStageStats(activeStage.categoryId);

  // Total completed stages count (100% or >70%)
  const completedStagesCount = ROADMAP_STAGES.filter(s => getStageStats(s.categoryId).percent >= 70).length;
  const overallRoadmapPercent = Math.round(
    ROADMAP_STAGES.reduce((acc, s) => acc + getStageStats(s.categoryId).percent, 0) / ROADMAP_STAGES.length
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>DevOps Engineer Learning Path</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            DevOps Path Roadmap (Дорожная Карта Обучения)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Пошаговый трек подготовки от базового Linux и сетей до Kubernetes, IaC и Облачной архитектуры.
          </p>
        </div>

        {/* Total Roadmap Stats Badge */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center space-x-4 shrink-0">
          <div className="text-center">
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {completedStagesCount}/{ROADMAP_STAGES.length}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Этапов Освоено</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-center">
            <div className="text-lg font-black text-emerald-500">
              {overallRoadmapPercent}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Прогресс Трека</div>
          </div>
        </div>
      </div>

      {/* VISUAL ROADMAP PROGRESS PIPELINE (Desktop & Mobile Scrollable Nodes) */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Этапы дорожной карты (нажмите на узел для разбора):</span>
          <span className="text-[11px] text-emerald-400 font-normal">Кликабельные этапы →</span>
        </div>

        {/* Nodes Timeline Wrapper */}
        <div className="relative pt-2 pb-4 overflow-x-auto scrollbar-none">
          
          {/* Horizontal Connection Line */}
          <div className="absolute top-8 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded-full" />
          
          {/* Active progress fill line */}
          <div 
            className="absolute top-8 left-8 h-1 bg-emerald-500 transition-all duration-500 -z-0 rounded-full"
            style={{
              width: `${(ROADMAP_STAGES.findIndex(s => s.categoryId === activeStageId) / (ROADMAP_STAGES.length - 1)) * 90}%`
            }}
          />

          <div className="flex items-start justify-between min-w-[720px] px-2 relative z-10 gap-2">
            {ROADMAP_STAGES.map((stage) => {
              const Icon = stage.icon;
              const stats = getStageStats(stage.categoryId);
              const isActive = stage.categoryId === activeStageId;
              const isComplete = stats.percent >= 70;

              return (
                <button
                  key={stage.categoryId}
                  onClick={() => setActiveStageId(stage.categoryId)}
                  className="flex flex-col items-center text-center group focus:outline-none transition-all"
                  style={{ width: `${100 / ROADMAP_STAGES.length}%` }}
                >
                  {/* Circle Node Button */}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-110 ring-4 ring-emerald-500/20'
                      : isComplete
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-emerald-400 group-hover:scale-105'
                  }`}>
                    <Icon className="w-5 h-5" />
                    {isComplete && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Stage Step Label */}
                  <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Этап {stage.step}
                  </div>

                  {/* Stage Title */}
                  <div className={`text-xs font-bold leading-tight mt-0.5 line-clamp-1 transition-colors ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-700 dark:text-slate-300 group-hover:text-emerald-500'
                  }`}>
                    {stage.title.split('&')[0]}
                  </div>

                  {/* Progress Pill */}
                  <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    stats.percent === 100
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : stats.percent > 0
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {stats.percent}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED NODE DETAILS CARD */}
      <div className={`p-6 rounded-2xl border transition-all ${activeStage.bgLight} border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${activeStage.color}`}>
              <activeStage.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Шаг {activeStage.step} из {ROADMAP_STAGES.length}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {activeStage.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeStage.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('questions', activeStage.categoryId)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-2 group"
          >
            <BookOpen className="w-4 h-4" />
            <span>Перейти к вопросам ({activeStats.mastered}/{activeStats.total})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stage Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Key Topics to Master */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Ключевые темы для изучения:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activeStage.topics.map((topic, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Tools & Technologies */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Обязательный стек утилиты:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeStage.keyTools.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Прогресс этого этапа:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{activeStats.percent}% ({activeStats.mastered} / {activeStats.total})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${activeStats.percent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
