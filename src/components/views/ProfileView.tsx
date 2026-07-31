import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Chrome, 
  LogOut, 
  Cloud, 
  CheckCircle, 
  ShieldAlert, 
  RefreshCw,
  Award,
  Terminal,
  Clock,
  BookOpen
} from 'lucide-react';
import { 
  signInWithGoogle, 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser,
  saveProgressToFirestore
} from '../../firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProgress } from '../../types';

interface ProfileViewProps {
  user: FirebaseUser | null;
  progress: UserProgress;
  isSyncing: boolean;
  onSyncManual: () => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  progress,
  isSyncing,
  onSyncManual
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualSyncSuccess, setManualSyncSuccess] = useState(false);

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Пожалуйста, введите корректный адрес электронной почты.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен состоять минимум из 6 символов.');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'register') {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают.');
          setLoading(false);
          return;
        }
        if (!displayName.trim()) {
          setError('Пожалуйста, введите ваше имя.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName.trim());
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже используется другим пользователем.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Неверный логин или пароль.');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль слишком слабый.');
      } else {
        setError(err.message || 'Произошла ошибка при авторизации.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError('Не удалось авторизоваться через Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const triggerManualSync = async () => {
    setManualSyncSuccess(false);
    try {
      await onSyncManual();
      setManualSyncSuccess(true);
      setTimeout(() => setManualSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Manual sync failed:', err);
    }
  };

  // Profile page metrics
  const masteredCount = progress.masteredQuestionIds?.length || 0;
  const bookmarkedCount = progress.bookmarkedQuestionIds?.length || 0;
  const quizCount = progress.quizResults?.length || 0;
  const solvedIncidents = progress.solvedIncidentIds?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* View Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          Личный кабинет <span className="text-emerald-500">DevOpsPro</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Синхронизируйте свой прогресс между устройствами и храните его надежно в облаке.
        </p>
      </div>

      {user ? (
        // Logged In Dashboard
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Info & Actions */}
          <div className="md:col-span-1 bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              {/* User Identity Details */}
              <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-2xl">
                  {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : <User className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white">{user.displayName || 'DevOps Инженер'}</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>

              {/* Sync Indicators */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Статус облака:</span>
                  <span className="flex items-center text-emerald-500 dark:text-emerald-400 font-bold space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Активно</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Вход выполнен через:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                    {user.providerData[0]?.providerId === 'google.com' ? 'Google Auth' : 'Email & Pass'}
                  </span>
                </div>
              </div>

              {/* Manual Synchronization Action */}
              <button
                onClick={triggerManualSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Синхронизация...' : 'Синхронизировать сейчас'}</span>
              </button>

              {manualSyncSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-slideUp">
                  Прогресс успешно синхронизирован!
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>

          {/* Sync Stats Dashboard */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Cloud Storage Welcome Info */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 p-6 flex items-start space-x-4">
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-400">Облачное резервное копирование включено</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ваши достижения, выполненные тесты, легенда опыта и решенные инциденты автоматически сохраняются в вашей учетной записи. Вы можете войти с другого браузера или телефона, и ваши данные подтянутся мгновенно!
                </p>
              </div>
            </div>

            {/* Sync Progress Breakdown Cards (Bento style) */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-center space-x-3.5">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Изучено вопросов</span>
                  <h5 className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{masteredCount}</h5>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-center space-x-3.5">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Решено тестов</span>
                  <h5 className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{quizCount}</h5>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-center space-x-3.5">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Решено инцидентов</span>
                  <h5 className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{solvedIncidents}</h5>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-center space-x-3.5">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">В закладках</span>
                  <h5 className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{bookmarkedCount}</h5>
                </div>
              </div>

            </div>

            {/* Experience Legend Sync confirmation if exists */}
            {progress.savedLegend && (
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">Сгенерированная легенда опыта сохранена</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Stack: {progress.savedLegend.stack.slice(0, 3).join(', ')}...</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500/20">
                  В облаке
                </span>
              </div>
            )}

          </div>

        </div>
      ) : (
        // Registration/Login forms
        <div className="max-w-md mx-auto bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Header Switch Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => { setAuthMode('login'); setError(null); }}
              className={`flex-1 pb-3 text-center text-xs font-bold transition-all border-b-2 ${
                authMode === 'login'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setAuthMode('register'); setError(null); }}
              className={`flex-1 pb-3 text-center text-xs font-bold transition-all border-b-2 ${
                authMode === 'register'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Form Message Banner */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {authMode === 'login' ? 'С возвращением!' : 'Создать новый аккаунт'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              {authMode === 'login' 
                ? 'Войдите, чтобы восстановить сохраненный прогресс обучения.' 
                : 'Зарегистрируйтесь, чтобы сохранять прогресс и решенные инциденты.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start space-x-2 text-rose-500 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Core Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Алексей"
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email адрес</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@devops.pro"
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Секунду...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-[1px] bg-slate-100 dark:bg-slate-800/80"></div>
            <span className="relative px-3 bg-white dark:bg-[#121927] text-[10px] font-bold text-slate-400 uppercase tracking-widest">ИЛИ</span>
          </div>

          {/* Google SSO Login */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-all text-xs font-bold cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-emerald-500" />
            <span>Войти через Google</span>
          </button>

        </div>
      )}
    </div>
  );
};
