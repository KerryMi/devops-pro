import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  BrainCircuit,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  score?: number;
  feedback?: string;
  timestamp: string;
}

interface MockInterviewViewProps {
  onCompleteSession?: () => void;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ onCompleteSession }) => {
  const [level, setLevel] = useState<'Junior' | 'Middle' | 'Senior'>('Middle');
  const [focusArea, setFocusArea] = useState<string>('Kubernetes & CI/CD');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Здравствуйте! Я Senior DevOps Lead и сегодня провожу с вами техническое собеседование на позицию DevOps Engineer (${level}).\n\nДавайте начнем! Расскажите кратко: как устроен процесс CI/CD на вашем последнем проекте и какова в нем ваша личная роль?`,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    if (onCompleteSession) {
      onCompleteSession();
    }

    try {
      const res = await fetch('/api/ai/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: newMessages,
          level,
          role: focusArea
        })
      });

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Принято. Расскажите подробнее про ваш опыт с Kubernetes.',
        score: data.score,
        feedback: data.feedback,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...newMessages, aiMsg]);
    } catch (e) {
      console.error('Interview chat error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetInterview = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Собеседование перезапущено. Уровень: ${level}. Жду вашего ответа: Какой у вас опыт работы с Linux ядрами и диагностикой High Load?`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Settings Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Tech Lead Interview Simulator</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Симулятор Технического Собеседования
            </h2>
          </div>

          <button
            onClick={handleResetInterview}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Начать заново</span>
          </button>
        </div>

        {/* Level and Focus Pickers */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Уровень:</span>
            {(['Junior', 'Middle', 'Senior'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  level === lvl ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-xs text-slate-400 font-medium">Фокус:</span>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="Kubernetes & CI/CD">Kubernetes & CI/CD</option>
              <option value="Linux & Troubleshooting">Linux & Troubleshooting</option>
              <option value="Terraform & Cloud">Terraform & Cloud</option>
              <option value="Observability & SRE">Observability & SRE</option>
            </select>
          </div>
        </div>

      </div>

      {/* Chat Messages Window */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2.5 rounded-2xl shrink-0 ${
                isUser 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] space-y-2`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  isUser
                    ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Score & Feedback badge if AI reply */}
                {!isUser && (msg.score || msg.feedback) && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Оценка ответа: {msg.score}/10</span>
                      </span>
                    </div>
                    {msg.feedback && <p className="text-slate-600 dark:text-amber-200/80">{msg.feedback}</p>}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 px-1 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-400 text-xs">
            <div className="p-2 rounded-2xl bg-slate-800 text-emerald-400">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <span className="italic">AI Tech Lead анализирует ваш ответ и готовит следующий вопрос...</span>
          </div>
        )}

      </div>

      {/* Input Form */}
      <div className="flex items-center space-x-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Напишите ваш ответ на вопрос интервьюера (Enter - отправить)..."
          rows={2}
          className="flex-1 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
