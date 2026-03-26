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
        <Link to="/" className="flex flex-col">
          <span className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#0F1113]">Giselle Soares</span>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#AF944F]">Estética de Unhas</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2
                ${location.pathname === link.path ? 'text-[#AF944F]' : 'text-gray-400 hover:text-[#0F1113]'}`}
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
                  className="w-10 h-10 flex items-center justify-center text-[#AF944F] hover:text-[#0F1113] hover:bg-gray-100 rounded-xl transition-all"
                >
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <Link to="/usuario" className="w-12 h-12 flex items-center justify-center bg-[#0F1113] text-white rounded-xl hover:bg-[#AF944F] transition-all shadow-lg">
                <User size={18} />
              </Link>
              <Button as={Link} to="/agendar" variant="secondary" size="sm">Agendar</Button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#0F1113] transition-all">Acesso</Link>
              <Button as={Link} to="/login" variant="primary" size="sm">Agendar</Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 bg-gray-50 rounded-xl text-black hover:bg-gray-100 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-40 lg:hidden flex flex-col p-8 pt-32"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-4xl font-serif font-black tracking-tighter
                    ${location.pathname === link.path ? 'text-[#AF944F]' : 'text-black'}`}
                >
                  {link.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-2xl font-serif font-black tracking-tighter text-[#AF944F]">
                  Dashboard
                </Link>
              )}
              <div className="h-[1px] bg-black/5 my-4" />
              <div className="flex flex-col gap-4">
                {user ? (
                  <Button as={Link} to="/usuario" variant="primary" size="lg" className="w-full">Minha Conta</Button>
                ) : (
                  <Button as={Link} to="/login" variant="primary" size="lg" className="w-full">Acesso Cliente</Button>
                )}
                <Button as={Link} to="/agendar" variant="secondary" size="lg" className="w-full text-center">Agendar</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
