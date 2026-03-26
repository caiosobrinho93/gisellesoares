import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Star, ShieldCheck, Award, Clock, ChevronRight, Fingerprint, Phone, Mail, X, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Section, { Container } from '../components/ui/Section';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDuration } from '../utils/slots';
import useReveal from '../hooks/useReveal';

export default function Home() {
  useReveal();
  const { logout } = useAuth();
  const { services } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const handleBookingClick = (service) => {
    if (!user) {
      navigate('/login', { state: { from: '/agendar', serviceId: service.id } });
    } else {
      navigate('/agendar', { state: { serviceId: service.id } });
    }
  };

  return (
    <div className="bg-black font-sans">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden pt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Estética de Unhas</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase">
                Curadoria <br />
                de <span className="text-gold">Beleza</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-12 font-normal">
                Precisa montar um visual especial? Aqui cada detalhe é pensado com cuidado e técnica para você chegar linda em qualquer ocasião.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('servicos').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gold text-black font-black text-[12px] tracking-[0.3em] uppercase py-6 px-12 rounded-2xl hover:bg-white transition-all shadow-xl text-center"
                >
                  Agendar Agora
                </button>
                <Button as={Link} to="/galeria" variant="outline" size="xl" className="border-white/10 text-white hover:bg-white hover:text-black text-[12px] tracking-[0.3em] uppercase h-auto py-6">
                  Ver Trabalhos
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative lg:block"
            >
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 brightness-90"
                  alt="Giselle Soares"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-noir border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl hidden md:block">
                <p className="text-3xl font-black text-gold mb-1">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Qualidade Técnica</p>
              </div>
            </motion.div>
          </div>
        </Container>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[120px] rounded-full translate-x-1/2" />
      </section>

      {/* FILOSOFIA */}
      <Section background="bg-black" className="py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 editorial-reveal">
            <div className="relative rounded-[40px] overflow-hidden border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop"
                className="w-full aspect-[16/10] object-cover rounded-[40px] brightness-75 hover:brightness-100 transition-all duration-700"
                alt="Biossegurança"
              />
            </div>
          </div>
          <div className="lg:col-span-6 editorial-reveal">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6 block">Higiene e Rigor</span>
            <h2 className="text-5xl md:text-7xl mb-8 leading-[0.9] text-white font-black uppercase">O Rigor da Perfeição</h2>
            <p className="text-lg text-gray-400 mb-12">
              Equipamentos esterilizados, técnica apurada e muito cuidado. Você fica tranquila e relaxa enquanto cuidamos da sua autoestima.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-noir border border-white/5">
                <ShieldCheck className="text-gold" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Biossegurança Total</span>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-noir border border-white/5">
                <Award className="text-gold" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Técnica Especializada</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-24 md:py-32 bg-black border-t border-white/5">
        <Container>
          <div className="max-w-3xl mb-16 md:mb-24 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-4 block">Seu Momento</span>
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6">Nossos Serviços</h2>
            <p className="text-lg text-gray-500 font-medium">Escolha o processo ideal para você e reserve seu horário.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (!user) {
                    navigate('/login', { state: { from: '/agendar', selectedService: s } });
                  } else {
                    navigate('/agendar', { state: { selectedService: s } });
                  }
                }}
                className="group flex flex-col text-left hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-6 shadow-2xl border border-white/5">
                  <img src={s.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={s.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-2xl font-black text-white uppercase mb-1">{s.name}</p>
                    <p className="text-gold font-black text-[10px] tracking-[0.3em] uppercase">VER DETALHES +</p>
                  </div>
                </div>
                <div className="px-2 flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{formatDuration(s.duration)}</span>
                  <span className="text-xl font-black text-white">R$ {s.price}</span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* MODAL SERVIÇO */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedService(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-noir w-full max-w-2xl rounded-[32px] overflow-hidden border border-white/10 relative z-10"
            >
              <div className="relative h-64 md:h-80">
                <img src={selectedService.image} className="w-full h-full object-cover" alt={selectedService.name} />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full hover:bg-gold transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-2">{selectedService.name}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gold text-xs font-black uppercase tracking-widest">
                        <Clock size={16} /> {formatDuration(selectedService.duration)}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="text-white text-xl font-black">R$ {selectedService.price}</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">{selectedService.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                    <CheckCircle2 size={18} className="text-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Materiais Higienizados</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                    <CheckCircle2 size={18} className="text-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Acabamento Premium</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBookingClick(selectedService)}
                  className="w-full bg-gold text-black font-black py-6 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.4em] text-[12px]"
                >
                  Agendar este Serviço
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CTA FINAL */}
      <section className="py-24 md:py-40">
        <Container>
          <div className="bg-noir p-12 md:p-24 rounded-[48px] border border-white/5 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <Fingerprint size={64} className="mx-auto text-gold mb-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Giselle Soares</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">Reserve um momento exclusivo para cuidar de você com a melhor técnica de estética de unhas da região.</p>
              <Button as={Link} to="/agendar" variant="gold" size="xl" className="h-20 px-16 text-[12px] tracking-[0.4em]">Agendar Agora</Button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[100px] rounded-full" />
          </div>
        </Container>
      </section>

      {/* FOOTER CONTATO */}
      <footer className="bg-black border-t border-white/5 py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-center">
            <div>
              <p className="text-2xl font-black text-white uppercase mb-1">Giselle Soares</p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Estética de Unhas</p>
            </div>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <a href="tel:17981602795" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all">
                <Phone size={16} className="text-gold" /> (17) 98160-2795
              </a>
              <a href="mailto:giselle@soares.com.br" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all">
                <Mail size={16} className="text-gold" /> giselle@soares.com.br
              </a>
            </div>
            <div className="md:text-right text-gray-600 text-[10px] font-black uppercase tracking-widest">
              © 2025 Giselle Soares. All rights Reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
