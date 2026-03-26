import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useReveal from '../hooks/useReveal';
import { Container } from '../components/ui/Section';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  useReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const res = register(formData);
    if (res.success) {
      navigate('/usuario');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  const setF = (f) => (e) => setFormData(p => ({ ...p, [f]: e.target.value }));

  return (
    <div className="bg-[#FCFBFA] min-h-screen flex items-center justify-center py-20 px-6">
      <Container className="max-w-2xl">
        <div className="p-12 md:p-20 bg-white border border-black/5 rounded-[40px] shadow-2xl relative overflow-hidden editorial-reveal">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-6 block">Novo Cadastro</span>
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-[#0F1113] uppercase">Criar <span className="text-[#AF944F]">Perfil</span>.</h1>
            <p className="text-gray-400 text-sm font-normal">Inicie sua jornada em direção ao cuidado absoluto.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <Input 
              label="Nome Completo" 
              placeholder="Digite seu nome..." 
              value={formData.name} 
              onChange={setF('name')} 
              required 
            />
            <Input 
              label="Endereço de E-mail" 
              type="email" 
              placeholder="vogue@lifestyle.com" 
              value={formData.email} 
              onChange={setF('email')} 
              required 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <Input 
                 label="WhatsApp (Contato)" 
                 placeholder="(17) 9..." 
                 value={formData.phone} 
                 onChange={setF('phone')} 
                 required
                />
               <Input 
                 label="Senha Privada" 
                 type="password" 
                 placeholder="••••••••" 
                 value={formData.password} 
                 onChange={setF('password')} 
                 required 
                />
            </div>
            
            {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] text-center">{error}</p>}

            <Button type="submit" variant="primary" size="xl" className="w-full mt-6 shadow-xl" disabled={loading}>
              {loading ? 'Inicializando...' : 'Criar Perfil'}
            </Button>
          </form>

          <div className="mt-16 text-center pt-10 border-t border-black/5">
            <p className="text-gray-400 text-[10px] font-black mb-8 uppercase tracking-widest">Já possui cadastro?</p>
            <Button as={Link} to="/login" variant="gold" size="lg" className="w-full uppercase tracking-widest text-[10px] font-black">Acessar</Button>
          </div>

          {/* Abstract Design Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF944F]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Giselle Soares — Noir Luxe ©</p>
      </Container>
    </div>
  );
}
