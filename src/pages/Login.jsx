import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useReveal from '../hooks/useReveal';
import { Container } from '../components/ui/Section';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  useReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const res = login(email, password);
    if (res.success) {
      navigate('/usuario');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen flex items-center justify-center py-20 px-6">
      <Container className="max-w-xl">
        <div className="p-12 md:p-20 bg-white border border-black/5 rounded-[40px] shadow-2xl relative overflow-hidden editorial-reveal">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-6 block">Área de Clientes</span>
            <h1 className="text-5xl md:text-6xl font-serif font-black mb-4 tracking-tighter text-[#0F1113]">Acesso <span className="italic-serif text-[#AF944F]">Restrito</span>.</h1>
            <p className="text-gray-400 text-sm font-light italic-serif">Acesse sua área pessoal e serviços exclusivos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <Input 
              label="Endereço de E-mail" 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Senha de Acesso" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            
            {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] text-center">{error}</p>}

            <Button type="submit" variant="primary" size="xl" className="w-full mt-6 shadow-xl" disabled={loading}>
              {loading ? 'Acessando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-16 text-center pt-10 border-t border-black/5">
            <p className="text-gray-400 text-xs font-light mb-8 italic-serif uppercase tracking-widest">Ainda não tem cadastro?</p>
            <Button as={Link} to="/cadastro" variant="gold" size="lg" className="w-full">Cadastrar-se</Button>
          </div>

          {/* Abstract Design Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF944F]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Giselle Soares — Noir Luxe ©</p>
      </Container>
    </div>
  );
}
