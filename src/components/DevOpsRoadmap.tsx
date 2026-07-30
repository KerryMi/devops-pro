import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryId, Question, UserProgress } from '../types';
import { calculateStageActivityStats } from '../utils/roadmapUtils';
import { calculateDetailedReadiness } from '../utils/readiness';
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
  ArrowRight, 
  Compass, 
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  AlertTriangle,
  Flame,
  Star,
  Brain
} from 'lucide-react';

interface RoadmapStage {
  step: number;
  categoryId: CategoryId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  accentColor: string;
  bgLight: string;
  topics: { name: string; isCore?: boolean }[];
  keyTools: string[];
  xpPerQuestion: number;
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    step: 1,
    categoryId: 'linux',
    title: 'Linux & System Internals',
    subtitle: 'База ОС, ядра, управление процессами, памятью и дисками',
    icon: Terminal,
    color: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    accentColor: '#f59e0b',
    bgLight: 'bg-amber-50/70 dark:bg-amber-950/20',
    topics: [
      { name: 'Systemd, init & управление службами', isCore: true },
      { name: 'Процессы, Сигналы (SIGTERM/SIGKILL) & PID 1', isCore: true },
      { name: 'Cgroups v2 & Linux Namespaces (Изоляция)', isCore: true },
      { name: 'Управление Памятью, Swap & OOM Killer', isCore: true },
      { name: 'Права доступа, Chmod/Chown & SSH ключи' }
    ],
    keyTools: ['journalctl', 'lsof', 'htop', 'systemctl', 'strace'],
    xpPerQuestion: 15
  },
  {
    step: 2,
    categoryId: 'networking',
    title: 'Сети & Безопасность',
    subtitle: 'Стек TCP/IP, DNS, TLS, IPTables и реверс-прокси',
    icon: Globe,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    accentColor: '#10b981',
    bgLight: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    topics: [
      { name: 'Модель OSI, TCP Handshake & UDP', isCore: true },
      { name: 'DNS Резолвинг, Записи (A, CNAME, TXT, MX)', isCore: true },
      { name: 'TLS/SSL Хэндшейк, Рут-сертификаты & SNI', isCore: true },
      { name: 'Nginx, Reverse Proxy & Балансировка', isCore: true },
      { name: 'Netfilter, IPTables & Файрволы' }
    ],
    keyTools: ['dig', 'tcpdump', 'curl', 'netstat', 'iptables'],
    xpPerQuestion: 15
  },
  {
    step: 3,
    categoryId: 'docker',
    title: 'Docker & Контейнеризация',
    subtitle: 'Изоляция, слои UnionFS, Multi-stage сборка и runtime',
    icon: Box,
    color: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    accentColor: '#3b82f6',
    bgLight: 'bg-blue-50/70 dark:bg-blue-950/20',
    topics: [
      { name: 'Docker Engine, Overlay2 & Copy-on-Write', isCore: true },
      { name: 'Dockerfile Best Practices & Оптимизация слоев', isCore: true },
      { name: 'Multi-stage Builds & Минималистичные образы', isCore: true },
      { name: 'Docker Networks (Bridge/Host) & Volumes', isCore: true },
      { name: 'Container Runtimes (containerd, runc)' }
    ],
    keyTools: ['docker', 'docker-compose', 'hadolint', 'crictl'],
    xpPerQuestion: 15
  },
  {
    step: 4,
    categoryId: 'cicd',
    title: 'CI/CD & GitOps Пайплайны',
    subtitle: 'Автоматизация сборок, релизные стратегии и ArgoCD',
    icon: GitBranch,
    color: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
    accentColor: '#f97316',
    bgLight: 'bg-orange-50/70 dark:bg-orange-950/20',
    topics: [
      { name: 'GitLab CI Pipelines & Runners', isCore: true },
      { name: 'GitHub Actions Workflows & Reusable Actions', isCore: true },
      { name: 'Стратегии развертывания (Canary / Blue-Green)', isCore: true },
      { name: 'GitOps & Синхронизация ArgoCD', isCore: true },
      { name: 'Helm Packaging & Чарты' }
    ],
    keyTools: ['GitLab CI', 'GitHub Actions', 'ArgoCD', 'Helm'],
    xpPerQuestion: 20
  },
  {
    step: 5,
    categoryId: 'k8s',
    title: 'Kubernetes & Оркестрация',
    subtitle: 'Control Plane, Pods, Ingress, CNI и автомасштабирование',
    icon: Layers,
    color: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
    accentColor: '#38bdf8',
    bgLight: 'bg-sky-50/70 dark:bg-sky-950/20',
    topics: [
      { name: 'Control Plane: kube-apiserver, etcd, scheduler', isCore: true },
      { name: 'Pods, Deployments, StatefulSets & DaemonSets', isCore: true },
      { name: 'Services, Ingress Controllers & Service Mesh', isCore: true },
      { name: 'CNI (Calico/Cilium), RBAC & NetworkPolicies', isCore: true },
      { name: 'Autoscaling (HPA, VPA, Karpenter)' }
    ],
    keyTools: ['kubectl', 'k9s', 'helm', 'kustomize'],
    xpPerQuestion: 25
  },
  {
    step: 6,
    categoryId: 'terraform',
    title: 'Infrastructure as Code (IaC)',
    subtitle: 'Декларативное управление инфраструктурой и Ansible',
    icon: Cpu,
    color: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    accentColor: '#a855f7',
    bgLight: 'bg-purple-50/70 dark:bg-purple-950/20',
    topics: [
      { name: 'Terraform State, Remote Backend & Locking', isCore: true },
      { name: 'Modules, Workspaces & DRY принципы', isCore: true },
      { name: 'Drift Detection & Terraform Plan analysis', isCore: true },
      { name: 'Ansible Playbooks, Roles & Идемпотентность', isCore: true },
      { name: 'Terragrunt Configurations & Packer' }
    ],
    keyTools: ['terraform', 'terragrunt', 'ansible', 'packer'],
    xpPerQuestion: 20
  },
  {
    step: 7,
    categoryId: 'monitoring',
    title: 'Observability & Мониторинг',
    subtitle: 'Метрики, логи, распределенный трейсинг и алертинг',
    icon: Activity,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    accentColor: '#10b981',
    bgLight: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    topics: [
      { name: 'Prometheus TSDB, Exporters & PromQL', isCore: true },
      { name: 'Grafana Dashboards & Дашборды наблюдения', isCore: true },
      { name: 'Alertmanager Rules & Дедупликация алертов', isCore: true },
      { name: 'Loki, Fluentbit & Централизованные логи', isCore: true },
      { name: 'OpenTelemetry (OTel) & Распределенный трейсинг' }
    ],
    keyTools: ['Prometheus', 'Grafana', 'Alertmanager', 'Vector'],
    xpPerQuestion: 20
  },
  {
    step: 8,
    categoryId: 'cloud',
    title: 'Облака & System Design',
    subtitle: 'High Availability архитектура, S3, IAM и DR стратегии',
    icon: Cloud,
    color: 'text-teal-500 border-teal-500/30 bg-teal-500/10',
    accentColor: '#14b8a6',
    bgLight: 'bg-teal-50/70 dark:bg-teal-950/20',
    topics: [
      { name: 'High Availability (HA) & Fault Tolerance Design', isCore: true },
      { name: 'S3 Object Storage, Buckets & IAM Policies', isCore: true },
      { name: 'Managed K8s, Managed Databases (PostgreSQL)', isCore: true },
      { name: 'Disaster Recovery (RTO / RPO планирование)', isCore: true },
      { name: 'Cost Optimization (FinOps) & Cloud Security' }
    ],
    keyTools: ['AWS / Yandex Cloud', 'S3', 'Vault', 'Load Balancers'],
    xpPerQuestion: 25
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
  const [filterMode, setFilterMode] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Calculate progress stats for each stage using multi-activity tracking
  const getStageStats = (catId: CategoryId) => {
    return calculateStageActivityStats(catId, questions, progress);
  };

  const activeStage = ROADMAP_STAGES.find(s => s.categoryId === activeStageId) || ROADMAP_STAGES[0];
  const activeStats = getStageStats(activeStage.categoryId);

  // Overall roadmap metrics based on detailed readiness
  const completedStagesCount = ROADMAP_STAGES.filter(s => getStageStats(s.categoryId).overallPercent >= 80).length;
  const inProgressStagesCount = ROADMAP_STAGES.filter(s => {
    const p = getStageStats(s.categoryId).overallPercent;
    return p > 0 && p < 80;
  }).length;
  
  const detailedReadiness = calculateDetailedReadiness(progress, questions);
  const overallRoadmapPercent = detailedReadiness.totalScore;

  // Smart recommended stage (lowest overall percent)
  const sortedStagesByPercent = [...ROADMAP_STAGES].sort(
    (a, b) => getStageStats(a.categoryId).overallPercent - getStageStats(b.categoryId).overallPercent
  );
  const recommendedStage = sortedStagesByPercent.find(s => getStageStats(s.categoryId).overallPercent < 80) || sortedStagesByPercent[0];
  const recommendedStats = getStageStats(recommendedStage.categoryId);

  // Filter stages based on current filter mode
  const filteredStages = ROADMAP_STAGES.filter(s => {
    const stats = getStageStats(s.categoryId);
    if (filterMode === 'completed') return stats.status === 'completed';
    if (filterMode === 'in_progress') return stats.status === 'in_progress';
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 shadow-md space-y-4 sm:space-y-6 relative overflow-hidden transition-all">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-black tracking-wider uppercase border border-emerald-500/20">
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Roadmap</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2 tracking-tight">
            <span>DevOps Career Skill Tree</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              v2.5
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Кликайте по этапам ветки развития, прокачивайте навыки от Linux ядра до Kubernetes и Cloud Architecture.
          </p>
        </div>

        {/* Gamification Stats Header Card */}
        <div className="bg-slate-50/90 dark:bg-[#0b1120]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between space-x-2 sm:space-x-4 shrink-0 shadow-inner w-full sm:w-auto">
          <div className="text-center px-1 flex-1 sm:flex-initial">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                {completedStagesCount}/{ROADMAP_STAGES.length}
              </span>
            </div>
            <div className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Ветвей</div>
          </div>

          <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="text-center px-1 flex-1 sm:flex-initial">
            <div className="flex items-center justify-center space-x-1">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500" />
              <span className="text-base sm:text-lg font-black text-emerald-500 font-mono">
                {overallRoadmapPercent}%
              </span>
            </div>
            <div className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Прогресс</div>
          </div>

          <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="text-center px-1 flex-1 sm:flex-initial">
            <span className="text-[10px] sm:text-xs font-black text-purple-500 uppercase px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
              {overallRoadmapPercent >= 80 ? 'Senior' : overallRoadmapPercent >= 45 ? 'Middle' : 'Junior'}
            </span>
            <div className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">Ранг</div>
          </div>
        </div>
      </div>

      {/* SMART RECOMMENDED QUEST BANNER */}
      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600/10 via-emerald-600/10 to-teal-600/10 border border-blue-500/20 dark:border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 relative overflow-hidden group">
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-500 text-white tracking-wider">
                Рекомендация
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Этап {recommendedStage.step}: {recommendedStage.title} ({recommendedStats.overallPercent}%)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
              {recommendedStats.recommendedActivity.title}: {recommendedStats.recommendedActivity.description}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              setActiveStageId(recommendedStage.categoryId);
              onNavigate(recommendedStats.recommendedActivity.type, recommendedStage.categoryId);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>{recommendedStats.recommendedActivity.actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span>Карта Навыков:</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Все ({ROADMAP_STAGES.length})
          </button>
          <button
            onClick={() => setFilterMode('in_progress')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
              filterMode === 'in_progress'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            В процессе ({inProgressStagesCount})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
              filterMode === 'completed'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Освоены ({completedStagesCount})
          </button>
        </div>
      </div>

      {/* GAME SKILL TREE TIMELINE NODES (Touch scrollable desktop/tablet view) */}
      <div className="relative pt-2 pb-4 sm:pt-3 sm:pb-6 overflow-x-auto scrollbar-none snap-x">
        
        {/* Connection Track Line behind Nodes */}
        <div className="absolute top-8 sm:top-10 left-8 sm:left-10 right-8 sm:right-10 h-1 sm:h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full pointer-events-none" />
        
        {/* Active Stage Progress line */}
        <div 
          className="absolute top-8 sm:top-10 left-8 sm:left-10 h-1 sm:h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 transition-all duration-500 rounded-full pointer-events-none"
          style={{
            width: `${(ROADMAP_STAGES.findIndex(s => s.categoryId === activeStageId) / (ROADMAP_STAGES.length - 1)) * 92}%`
          }}
        />

        {/* Nodes Container */}
        <div className="flex items-start justify-between min-w-[650px] sm:min-w-[800px] px-2 relative z-10 gap-2 sm:gap-3">
          {filteredStages.map((stage) => {
            const Icon = stage.icon;
            const stats = getStageStats(stage.categoryId);
            const isActive = stage.categoryId === activeStageId;
            const isCompleted = stats.overallPercent >= 80;

            let statusBadge = (
              <span className="text-[9px] font-bold text-slate-400">0%</span>
            );

            if (isCompleted) {
              statusBadge = (
                <span className="text-[9px] font-extrabold text-emerald-500 flex items-center space-x-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>100%</span>
                </span>
              );
            } else if (stats.overallPercent > 0) {
              statusBadge = (
                <span className="text-[9px] font-extrabold text-blue-500">
                  {stats.overallPercent}%
                </span>
              );
            }

            return (
              <button
                key={stage.categoryId}
                onClick={() => setActiveStageId(stage.categoryId)}
                className="flex flex-col items-center text-center group focus:outline-none cursor-pointer transition-all snap-center"
                style={{ width: `${100 / filteredStages.length}%` }}
              >
                {/* Level Node Circle */}
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-white text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 sm:scale-110 ring-2 sm:ring-4 ring-emerald-500/20'
                        : isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-sm'
                          : stats.overallPercent > 0
                            ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                            : 'bg-white dark:bg-[#121927] border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />

                    {/* Checkmark Badge on Node */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    )}

                    {/* Active Pulsing Indicator */}
                    {isActive && (
                      <span className="absolute -bottom-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </motion.div>
                </div>

                {/* Step Level Badge */}
                <span className={`mt-2 text-[8px] sm:text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  Уровень {stage.step}
                </span>

                {/* Title */}
                <div className={`text-[11px] sm:text-xs font-bold leading-tight mt-1 line-clamp-1 transition-colors ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' 
                    : 'text-slate-700 dark:text-slate-300 group-hover:text-emerald-500'
                }`}>
                  {stage.title.split('&')[0]}
                </div>

                {/* Micro Progress */}
                <div className="mt-0.5">
                  {statusBadge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED NODE INTERACTIVE DETAILED CARD */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeStage.categoryId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all ${activeStage.bgLight} border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 shadow-xs`}
        >
          {/* Node Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${activeStage.color} shadow-sm shrink-0 mt-0.5 sm:mt-0`}>
                <activeStage.icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Уровень {activeStage.step} из {ROADMAP_STAGES.length}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400">
                    {activeStats.overallPercent}% общего освоения
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {activeStage.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 max-w-xl leading-relaxed">
                  {activeStage.subtitle}
                </p>
              </div>
            </div>

            {/* Overall Stage Meter */}
            <div className="bg-white/90 dark:bg-[#0b1120]/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shrink-0 min-w-[200px]">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Прогресс этапа:</span>
                <span className="text-emerald-500 font-mono font-black">{activeStats.overallPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeStats.overallPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* STAGE ACTIVITIES (4 ACTIVITIES BY CATEGORY) */}
          <div className="space-y-3">
            <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Активности этапа ({activeStage.title.split('&')[0]}):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Questions */}
              <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black font-mono text-blue-500">
                      {activeStats.questionsPercent}%
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Теория & Вопросы</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Освоено {activeStats.masteredQuestions} из {activeStats.totalQuestions}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('questions', activeStage.categoryId)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-500 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Учить вопросы</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Flashcards */}
              <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black font-mono text-purple-500">
                      {activeStats.cardsPercent}%
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Флеш-карточки</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Повторено {activeStats.reviewedCards} из {activeStats.totalCards}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('flashcards', activeStage.categoryId)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-500 hover:text-white text-purple-600 dark:text-purple-400 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Повторить карточки</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Quizzes */}
              <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black font-mono text-amber-500">
                      {activeStats.quizzesPercent}%
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Тесты с таймером</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeStats.totalQuizzes > 0 ? `Сдано ${activeStats.passedQuizzes} из ${activeStats.totalQuizzes}` : 'Сдайте проверочный тест'}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quizzes', activeStage.categoryId)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Пройти тесты</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Incidents */}
              <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-rose-500/40 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black font-mono text-rose-500">
                      {activeStats.incidentsPercent}%
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Аварии в Prod</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeStats.totalIncidents > 0 ? `Решено ${activeStats.solvedIncidents} из ${activeStats.totalIncidents}` : 'Решите симуляцию сбоя'}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('incidents', activeStage.categoryId)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Решить аварии</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Node Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Core Interview Topics */}
            <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2.5 sm:space-y-3">
              <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  <span>Ключевые Вопросы Собеседования:</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">5 тем</span>
              </div>

              <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                {activeStage.topics.map((topic, idx) => (
                  <div 
                    key={idx}
                    className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-[#0b1120]/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span className="leading-snug">{topic.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 sm:space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                    <span>Обязательные Утилиты & Стек:</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">Must Have</span>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeStage.keyTools.map((tool, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
