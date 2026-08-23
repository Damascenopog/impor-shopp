import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated } = useAdminStore();

  const [email, setEmail] = useState('admin@imporshopp.com.br');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect directly to dashboard
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Credenciais inválidas.');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@imporshopp.com.br');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back to store link */}
      <div className="max-w-md w-full mx-auto mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Loja Imporshopp</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/60 border border-red-800/40 text-[#f20606] mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">
            Painel <span className="text-[#f20606]">Administrativo</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestão de Pedidos, Produtos e Status da Loja
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-6 sm:p-8 shadow-2xl">
          
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                E-mail Administrativo
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@imporshopp.com.br"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#f20606] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#f20606] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#f20606] hover:bg-[#d40505] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Dashboard'}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-6 pt-5 border-t border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 mb-2">Credenciais padrão para teste rápido:</p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono bg-[#0d1117] hover:bg-black text-gray-300 px-3 py-1.5 rounded border border-gray-700 transition-colors inline-block cursor-pointer"
            >
              admin@imporshopp.com.br / admin123
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
