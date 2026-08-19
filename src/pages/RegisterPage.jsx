import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      register(formData);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 400);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <div className="max-w-md w-full mx-auto mb-4 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Início</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">Cadastre-se</span>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-900">
            Criar Uma Conta
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compre mais rápido e acompanhe seus pedidos em um só lugar!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-6 text-center space-y-3 bg-green-50 rounded-[4px] border border-green-200">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-sm font-bold text-green-900">Conta criada com sucesso!</h3>
            <p className="text-xs text-green-700">Redirecionando para a loja...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex.: Maria Perez"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ex.: seunome@email.com.br"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Telefone / WhatsApp (opcional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="ex.: (21) 97289-3879"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Confirmar Senha *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold py-3.5 px-4 rounded-[4px] uppercase text-xs tracking-wider shadow-md transition-colors mt-2"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar Uma Conta'}
            </button>

          </form>
        )}

        {/* Login CTA */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Já possui uma conta?{' '}
            <Link
              to="/account/login"
              className="text-[#f20606] font-bold hover:underline ml-1"
            >
              Faça login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
