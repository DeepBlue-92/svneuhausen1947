import React, { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
      setError(false);
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-club-50 text-club-600 rounded-full mb-3">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Interner Bereich</h2>
          <p className="text-sm text-slate-600">Zugang für Vereinsverantwortliche.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Benutzername</label>
                <input 
                type="text" 
                className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-club-500/20 focus:border-club-500 transition-all shadow-sm placeholder:text-slate-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Benutzername"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
                <input 
                type="password" 
                className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-club-500/20 focus:border-club-500 transition-all shadow-sm placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-100 p-2 rounded-lg">
                <AlertCircle size={14} />
                <span>Zugangsdaten ungültig</span>
                </div>
            )}

            <button 
                type="submit"
                className="w-full bg-club-600 hover:bg-club-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm mt-2"
            >
                Anmelden
            </button>
            <p className="text-xs text-center text-slate-500 mt-4 px-2">
                Bei Problemen wenden Sie sich bitte an den Hauptadministrator.
            </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;