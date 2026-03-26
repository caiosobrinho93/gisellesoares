import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'Esmaltes', path: '/esmaltes' },
    { name: 'Agendar', path: '/agendar' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-luxe py-4' : 'bg-transparent py-6'}`}>
      <div className="container-luxe flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex flex-col relative z-50">
          <span className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-500 
            ${scrolled || isOpen || ['/login', '/cadastro'].includes(location.pathname) ? 'text-[#0F1113]' : 'text-white'}`}>Giselle Soares</span>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#AF944F]">Estética de Unhas</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2
                ${location.pathname === link.path ? 'text-[#AF944F]' : scrolled ? 'text-gray-400 hover:text-[#0F1113]' : 'text-gray-300 hover:text-white'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-luxe" className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#AF944F] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  title="Dashboard"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all
                    ${scrolled ? 'text-[#AF944F] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                >
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <Link to="/usuario" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg
                ${scrolled ? 'bg-[#0F1113] text-white hover:bg-[#AF944F]' : 'bg-white text-[#0F1113] hover:bg-[#AF944F] hover:text-white'}`}>
                <User size={18} />
              </Link>
              <Button as={Link} to="/agendar" variant={scrolled ? 'secondary' : 'gold'} size="sm">Agendar</Button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all
                ${scrolled ? 'text-gray-500 hover:text-[#0F1113]' : 'text-gray-300 hover:text-white'}`}>Acesso</Link>
              <Button as={Link} to="/login" variant={scrolled ? 'primary' : 'outline'} size="sm">Agendar</Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-3 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center relative z-50
          ${scrolled || isOpen ? 'bg-gray-100 text-black' : 'bg-white/10 text-white'}`}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-40 lg:hidden flex flex-col p-8 pt-32"
          >
            {/* User Header in Menu */}
            {user ? (
              <div className="flex items-center gap-4 mb-12 p-6 bg-gray-50 rounded-3xl border border-black/5">
                <div className="w-16 h-16 bg-[#0F1113] text-[#AF944F] rounded-2xl flex items-center justify-center text-2xl font-black">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" /> : user.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Bem-vinda,</p>
                  <p className="text-xl font-black text-[#0F1113]">{user.name.split(' ')[0]}</p>
                </div>
              </div>
            ) : (
              <div className="mb-12 p-6 bg-[#AF944F]/10 rounded-3xl border border-[#AF944F]/20">
                <p className="text-sm font-bold text-[#AF944F] mb-4">Acesse sua conta para agendar e ver seus horários.</p>
                <Button as={Link} to="/login" variant="gold" size="md" className="w-full">Entrar na Conta</Button>
              </div>
            )}

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-4xl font-black tracking-tighter uppercase
                    ${location.pathname === link.path ? 'text-[#AF944F]' : 'text-[#0F1113]'}`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-2xl font-black tracking-tighter text-[#AF944F] uppercase pt-4 border-t border-black/5">
                  Painel Administrativo
                </Link>
              )}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {user && (
                <Button as={Link} to="/usuario" variant="primary" size="lg" className="w-full py-6">Minha Área</Button>
              )}
              <Button as={Link} to="/agendar" variant="secondary" size="lg" className="w-full py-6">Agendar Novo Horário</Button>
              
              {user && (
                <button 
                  onClick={() => { setIsOpen(false); /* logout via context call might be needed if not globally accessible */ }}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 py-4"
                >
                  Sair da Conta
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
