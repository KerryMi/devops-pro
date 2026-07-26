import React, { useState } from 'react';
import { RESUME_CHECKLIST, POWER_PHRASES } from '../data/resumeGuide';
import { 
  FileText, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Sparkles, 
  Plus,
  Trash2,
  FileCode,
  User,
  Briefcase,
  Wrench,
  GraduationCap,
  Wand2,
  RefreshCw
} from 'lucide-react';

interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  achievements: string;
}

const INITIAL_FORM = {
  fullName: 'Алексей Смирнов',
  targetRole: 'Senior DevOps / SRE / Infrastructure Engineer',
  location: 'Москва (готов к удаленке / релокации)',
  email: 'alexey.devops@example.com',
  telegram: '@alexey_devops',
  github: 'https://github.com/alexey-devops',
  linkedin: 'https://linkedin.com/in/alexey-devops',
  summary: 'DevOps / SRE инженер с 5+ годами опыта проектирования отказоустойчивой инфраструктуры в Kubernetes, автоматизации CI/CD и внедрения практик GitOps. Специализируюсь на оптимизации облачных расходов (FinOps), улучшении метрик MTTR/MTTD и управлении высоконагруженными Prod-средами.',
  skills: {
    orchestration: 'Kubernetes (K8s), Helm, ArgoCD, Docker, Containerd',
    iac: 'Terraform, Terragrunt, Ansible, Packer',
    cicd: 'GitLab CI/CD, GitHub Actions, Jenkins, HashiCorp Vault',
    monitoring: 'Prometheus, Grafana, VictoriaMetrics, ELK, Loki, Tempo',
    clouds: 'Yandex Cloud, AWS (EKS, S3, IAM, VPC), Bare-metal, Linux (Ubuntu/Debian)'
  },
  experiences: [
    {
      id: '1',
      company: 'FinTech Cloud Platform',
      role: 'Lead DevOps / SRE Engineer',
      period: '2022 — Настоящее время',
      achievements: `• Перевел 40+ микросервисов в Kubernetes кластеры под управлением ArgoCD (GitOps).
• Внедрил Karpenter / Cluster Autoscaler и spot-инстансы, сократив расходы на облако на 35% ($12,000/мес).
• Настроил сквозной мониторинг на базе VictoriaMetrics + Grafana + Alertmanager, снизив MTTR со 120 до 15 минут.
• Разработал Helm-чарты и единые пайплайны GitLab CI, ускорив выкатку релизов с 1 раза в неделю до 10+ раз в день.`
    },
    {
      id: '2',
      company: 'E-Commerce Enterprise',
      role: 'Middle DevOps Engineer',
      period: '2020 — 2022',
      achievements: `• Автоматизировал разворачивание dev/stage окружений с помощью Terraform и Ansible с 3 дней до 15 минут.
• Разработал процедуру Zero-Downtime деплоя (Blue/Green, Canary) для интернет-магазина под нагрузкой 100k RPS.
• Внедрил HashiCorp Vault для безопасного хранения секретов и автоматической ротации API-ключей в CI/CD.`
    }
  ],
  education: 'МГТУ им. Н.Э. Баумана, Информатика и системы управления (2016 - 2020)',
  certifications: 'Certified Kubernetes Administrator (CKA), AWS Certified Solutions Architect Associate'
};

export const ResumeGuideView: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [copiedPhraseIdx, setCopiedPhraseIdx] = useState<number | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  
  // Resume Generator Form State
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Resume Critique AI State
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ feedback: string; score: number } | null>(null);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / RESUME_CHECKLIST.length) * 100);

  const handleCopyPhrase = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPhraseIdx(idx);
    setTimeout(() => setCopiedPhraseIdx(null), 2000);
  };

  const generateMarkdownResume = () => {
    return `# ${formData.fullName || 'Имя Фамилия'}
### ${formData.targetRole || 'Желаемая Должность'}

**Контакты:**
- **Email:** ${formData.email}
- **Telegram:** ${formData.telegram}
- **GitHub:** ${formData.github}
- **LinkedIn:** ${formData.linkedin}
- **Локация:** ${formData.location}

---

## О себе
${formData.summary}

---

## Ключевые навыки & Стек технологий
- **Оркестрация & Контейнеры:** ${formData.skills.orchestration}
- **IaC & Управление конфигурацией:** ${formData.skills.iac}
- **CI/CD & Автоматизация:** ${formData.skills.cicd}
- **Observability & Мониторинг:** ${formData.skills.monitoring}
- **Облака & Инфраструктура:** ${formData.skills.clouds}

---

## Опыт работы

${formData.experiences.map(exp => `### ${exp.role} — ${exp.company}
*${exp.period}*

${exp.achievements}`).join('\n\n---\n\n')}

---

## Образование
${formData.education}

---

## Сертификаты
${formData.certifications}
`;
  };

  const generatedMarkdown = generateMarkdownResume();

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: 'Название компании',
      role: 'DevOps Engineer',
      period: '2023 — Настоящее время',
      achievements: '• Опишите ваше ключевое достижение с метрикой (например: сократил время сборки на 40%).'
    };
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, val: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: val } : exp)
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn min-w-0">
      
      {/* Title Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Карьерный Модуль</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Гайд по Резюме DevOps Инженера & Генератор Markdown
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Создайте продающее резюме, которое проходит ATS-фильтры HR-систем, автоматически сгенерируйте готовый Markdown-код для GitHub / HH / Notion и отправьте на проверку нейросети.
        </p>
      </div>

      {/* MARKDOWN RESUME GENERATOR FORM SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Генератор Резюме в формате Markdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Заполните форму ниже — и получите идеальный Markdown-текст резюме
              </p>
            </div>
          </div>

          <button
            onClick={() => setFormData(INITIAL_FORM)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Заполнить шаблоном</span>
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>1. Личная информация и контакты</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Имя и Фамилия</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Алексей Смирнов"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Желаемая Должность</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="Senior DevOps / SRE Engineer"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alexey@example.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Telegram</label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@telegram_handle"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={e => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Локация / Статус</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Москва (удаленка / релокация)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">О себе (Summary)</label>
              <textarea
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                placeholder="Кратко опишите ваш опыт, сильные стороны и ключевые направления..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Skills Stack */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              <span>2. Технологический стек</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Оркестрация & Контейнеры</label>
                <input
                  type="text"
                  value={formData.skills.orchestration}
                  onChange={e => setFormData({ ...formData, skills: { ...formData.skills, orchestration: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">IaC & Конфигурация</label>
                <input
                  type="text"
                  value={formData.skills.iac}
                  onChange={e => setFormData({ ...formData, skills: { ...formData.skills, iac: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">CI/CD & Секреты</label>
                <input
                  type="text"
                  value={formData.skills.cicd}
                  onChange={e => setFormData({ ...formData, skills: { ...formData.skills, cicd: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Мониторинг & Логирование</label>
                <input
                  type="text"
                  value={formData.skills.monitoring}
                  onChange={e => setFormData({ ...formData, skills: { ...formData.skills, monitoring: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Облачные провайдеры & ОС</label>
                <input
                  type="text"
                  value={formData.skills.clouds}
                  onChange={e => setFormData({ ...formData, skills: { ...formData.skills, clouds: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Work Experience */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>3. Опыт работы</span>
              </div>
              <button
                onClick={handleAddExperience}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить место работы</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Место #{idx + 1}</span>
                    {formData.experiences.length > 1 && (
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Компания</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Должность</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Период работы</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={e => handleUpdateExperience(exp.id, 'period', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Достижения (с метриками и цифрами)</label>
                    <textarea
                      value={exp.achievements}
                      onChange={e => handleUpdateExperience(exp.id, 'achievements', e.target.value)}
                      rows={3}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Education & Certs */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>4. Образование и Сертификаты</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Образование</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Сертификаты</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Generated Markdown Preview Box */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>Сгенерированное Резюме (Markdown)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyMarkdown}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                  copiedMarkdown
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {copiedMarkdown ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMarkdown ? 'Скопировано!' : 'Скопировать Markdown'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-w-full border border-slate-800 leading-relaxed whitespace-pre-wrap">
            <code>{generatedMarkdown}</code>
          </pre>
        </div>

      </div>

      {/* Interactive Checklist Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
        
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-500" />
            <span>Интерактивный Чек-лист Резюме ({completedCount}/{RESUME_CHECKLIST.length})</span>
          </h3>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {progressPercent}% Выполнено
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-3 pt-2">
          {RESUME_CHECKLIST.map((item) => {
            const isDone = !!completedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-xs ${
                  isDone 
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className={isDone ? 'line-through text-slate-400' : ''}>{item.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-500 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Power Phrases Vault */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Банк Сильных Формулировок Достижений (Power Phrases)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Готовые буллеты для раздела "Опыт работы". Нажмите, чтобы скопировать в буфер обмена.
        </p>

        <div className="space-y-2">
          {POWER_PHRASES.map((phrase, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 hover:border-indigo-500/40 transition-colors gap-2"
            >
              <span className="leading-relaxed">• {phrase}</span>
              <button
                onClick={() => handleCopyPhrase(phrase, idx)}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300 shrink-0 transition-colors"
                title="Копировать"
              >
                {copiedPhraseIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

