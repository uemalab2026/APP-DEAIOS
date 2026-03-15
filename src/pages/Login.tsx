import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Eye, EyeOff } from 'lucide-react';

const getAuthErrorMessage = (error: string): string => {
  const map: Record<string, string> = {
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada ou entre em contato com o administrador.',
    'Invalid login credentials': 'Email ou senha incorretos. Tente novamente.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'User not found': 'Usuário não encontrado. Verifique o email digitado.',
  };
  return map[error] || error || 'Email ou senha incorretos. Tente novamente.';
};

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Campos obrigatórios', 'Por favor, preencha email e senha.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      showError('Falha no login', getAuthErrorMessage(result.error || ''));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Element (Clairis style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[500px] bg-white transform -rotate-6 shadow-soft opacity-40 rounded-[100px]" />
      
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-card p-10 relative z-10 mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-glow">
              <span className="text-white font-heading font-bold text-2xl leading-none">D</span>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-primary">DEAIOS</span>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-primary mb-2">Bem-vindo ao DEAIOS! 👋</h1>
            <p className="text-sm text-secondary">
              Por favor, entre na sua conta para acessar o painel de performance.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white border border-border rounded-lg px-4 py-3.5 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="w-full bg-white border border-border rounded-lg px-4 py-3.5 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-start">
            <a href="#" className="text-sm text-accent hover:text-accent-dim font-medium transition-colors">
              Esqueceu sua senha?
            </a>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-12 text-white shadow-[0_4px_14px_0_rgba(181,135,87,0.39)] hover:shadow-[0_6px_20px_rgba(181,135,87,0.23)] hover:bg-[#A67D4E]"
            isLoading={isLoading}
          >
            ENTRAR
          </Button>
        </form>

      </div>
        <div className="mt-8 text-center text-sm text-secondary relative z-10 font-medium">
          Dúvidas no acesso? <a href="#" className="text-accent hover:underline">Fale com o suporte corporativo</a>
        </div>
    </div>
  );
};

export default Login;
