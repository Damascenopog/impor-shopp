import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(email, password);
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetEmailSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmailSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <div className="max-w-md w-full mx-auto mb-4 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Início</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">Login</span>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-900">
            Iniciar Sessão
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Acesse sua conta para acompanhar seus pedidos
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex.: seuemail@email.com.br"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Senha
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] text-gray-500 hover:text-black hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ex.: suasenha"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold py-3 px-4 rounded-[4px] uppercase text-xs tracking-wider shadow-md transition-colors mt-2"
          >
            {isSubmitting ? 'Iniciando sessão...' : 'Iniciar Sessão'}
          </button>

        </form>

        {/* Register CTA */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Não possui uma conta ainda?{' '}
            <Link
              to="/account/register"
              className="text-[#f20606] font-bold hover:underline ml-1"
            >
              Criar uma conta
            </Link>
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-[4px] p-6 shadow-xl animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-gray-900 uppercase mb-2">Recuperar Senha</h3>
            <p className="text-xs text-gray-500 mb-4">
              Informe seu e-mail para receber as instruções de redefinição de senha.
            </p>

            {resetEmailSent ? (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded mb-4">
                Instruções enviadas para seu e-mail! Verifique sua caixa de entrada.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail cadastrado"
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#f20606] hover:bg-[#d40505] rounded"
                  >
                    Enviar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
