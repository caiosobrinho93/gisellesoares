import { motion } from 'framer-motion';
import { Sparkles, Calendar, Instagram, MapPin, Star, ShieldCheck, HeartPulse, Clock, ChevronRight, ArrowUpRight, Award, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section, { Container } from '../components/ui/Section';
import { useApp } from '../contexts/AppContext';
import { formatDuration } from '../utils/slots';
import useReveal from '../hooks/useReveal';

export default function Home() {
  useReveal();
  const { services } = useApp();
  const featured = services.slice(0, 3);

  return (
    <div className="bg-[#F5F5F7]">
      {/* HERO: LUXE CLINIC / PROFESSIONAL */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F1113] overflow-hidden">
        <div className="container-luxe relative z-10 py-16 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-[1.5px] bg-[#AF944F] rounded-full" />
                   <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F]">Atendimento Exclusivo</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-serif font-black text-white leading-[1.1] mb-10 tracking-tight">
                   Onde a Excelência <br />
                   Encontra o <span className="italic-serif text-[#AF944F]">Sofisticado</span>.
                </h1>
                <p className="text-lg md:text-xl font-light text-gray-400 max-w-xl leading-relaxed mb-12">
                   Especialistas em biossegurança e estética de alto padrão. Redefinimos o conceito de manicure com precisão milimétrica e curadoria exclusiva.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                   <Button as={Link} to="/agendar" variant="secondary" size="xl" className="shadow-2xl">Agendar Consulta</Button>
                   <Button as={Link} to="/galeria" variant="outline" size="xl" className="border-white/20 text-white hover:bg-white hover:text-[#0F1113]">Ver Galeria</Button>
                </div>
             </motion.div>
             <div className="hidden lg:block">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 1.2 }}
                  className="relative p-8"
                >
                   <div className="absolute inset-0 border-[2px] border-[#AF944F]/20 rounded-[40px] translate-x-8 translate-y-8" />
                   <img 
                     src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop" 
                     className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-premium brightness-90 saturate-[0.8]" 
                     alt="Estética" 
                   />
                </motion.div>
             </div>
          </div>
        </div>
        {/* Abstract Background Layer */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#AF944F]/5 blur-[120px] rounded-full translate-x-1/2" />
      </section>

      {/* PHILOSOPHY: HIGH CONTRAST - LUXURY GRAY */}
      <Section background="bg-[#F5F5F7]">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="editorial-reveal">
               <img 
                 src="https://images.unsplash.com/photo-1632345031435-07ca681582d1?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full aspect-[16/10] object-cover rounded-[20px] shadow-premium" 
                 alt="Biossegurança" 
               />
               <div className="mt-8 flex gap-8">
                  <div className="bg-white p-8 rounded-[20px] flex-1 shadow-premium border border-black/5">
                     <p className="text-3xl font-serif font-black text-[#AF944F]">100%</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Seguro</p>
                  </div>
                  <div className="bg-white p-8 rounded-[20px] flex-1 shadow-premium border border-black/5">
                     <p className="text-3xl font-serif font-black text-[#AF944F]">Premium</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Material Elite</p>
                  </div>
               </div>
            </div>
            <div className="editorial-reveal">
               <div className="p-2 md:p-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#AF944F] mb-6 block">01 / Compromisso</span>
                  <h2 className="text-5xl md:text-7xl mb-10 leading-tight">Cuidado e Estética em <span className="italic-serif">Perfeita</span> Harmonia.</h2>
                  <p className="text-xl text-gray-500 font-light leading-relaxed mb-12">
                    Utilizamos os mais rigorosos protocolos de biossegurança combinados com a sofisticação da técnica de cuticulagem a seco.
                  </p>
                  <ul className="space-y-6">
                    {[
                      { icon: ShieldCheck, text: "Protocolo de Biossegurança" },
                      { icon: Award, text: "Técnicas Certificadas" },
                      { icon: Fingerprint, text: "Seleção de Cores Exclusiva" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-6 group">
                         <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-[#AF944F] group-hover:bg-[#AF944F] group-hover:text-white transition-all shadow-premium border border-black/5">
                            <item.icon size={24} />
                         </div>
                         <span className="text-[11px] font-bold uppercase tracking-[0.3em]">{item.text}</span>
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
         </div>
      </Section>

      {/* HIGHLIGHTS: HIGH CONTRAST - LUXURY GRAY */}
      <Section background="bg-[#F5F5F7]">
         <div className="text-center mb-24 editorial-reveal">
            <h2 className="text-5xl md:text-8xl font-serif font-black mb-6 tracking-tighter">Nossos Serviços.</h2>
            <p className="text-gray-400 font-light italic-serif text-xl">Uma curadoria pensada para elevar sua experiência de cuidado.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            {featured.length > 0 ? featured.map((s, i) => (
               <motion.div 
                 key={s.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2, duration: 0.8 }}
                 whileHover={{ y: -12 }}
                 className="group relative overflow-hidden rounded-[20px] bg-white shadow-premium hover:shadow-luxe-hover transition-all duration-700 h-full flex flex-col border border-black/5"
               >
                 {/* Image Container with Price Label */}
                 <div className="relative h-64 md:h-80 overflow-hidden shrink-0">
                    <img 
                      src={s.image} 
                      alt={s.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                    <div className="absolute top-6 right-6">
                       <div className="bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20 shadow-2xl">
                          <span className="text-white text-[11px] font-bold tracking-[0.2em] uppercase text-nowrap">R$ {s.price}</span>
                       </div>
                    </div>
                 </div>

                 {/* Content Area */}
                 <div className="p-12 flex flex-col flex-1">
                    <div className="mb-6">
                       <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-4 block opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-center">Procedimento de Elite</span>
                       <h3 className="text-3xl font-serif font-black mb-4 group-hover:text-[#AF944F] transition-colors leading-tight text-center">{s.name}</h3>
                    </div>
                    <p className="text-gray-500 text-base font-light leading-relaxed mb-auto italic-serif text-center">
                       {s.description}
                    </p>
                    <div className="flex justify-between items-center pt-10 mt-10 border-t border-black/5">
                       <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                          <Clock size={16} className="text-[#AF944F]" /> {formatDuration(s.duration)}
                       </div>
                       <Link to="/agendar" className="bg-[#0F1113] text-white p-4 rounded-[16px] hover:bg-[#AF944F] transition-all shadow-premium">
                          <ChevronRight size={20} />
                       </Link>
                    </div>
                 </div>
               </motion.div>
            )) : (
              <div className="col-span-3 text-center py-20 text-gray-300 italic-serif">Carregando serviços exclusivos...</div>
            )}
         </div>
      </Section>

      {/* CTA: PROFESSIONAL LUXE - DEEP DARK */}
      <Section background="bg-[#0F1113]">
         <div className="bg-[#AF944F]/5 p-20 md:p-32 rounded-[20px] text-center editorial-reveal border border-white/5 shadow-premium overflow-hidden relative group">
            <Star className="mx-auto mb-12 text-[#AF944F] group-hover:scale-110 transition-transform duration-700" size={48} strokeWidth={1} />
            <h2 className="text-6xl md:text-8xl font-serif font-black text-white mb-10 tracking-tighter">Vivencie a Exclusividade.</h2>
            <p className="text-2xl font-light text-gray-400 mb-20 max-w-3xl mx-auto italic-serif leading-relaxed">
               Nossa agenda é limitada para garantir a atenção absoluta que cada detalhe merece. Sua reserva é o início de um ritual.
            </p>
            <Button as={Link} to="/agendar" variant="secondary" size="xl" className="shadow-premium px-20">Solicitar Horário</Button>
            
            {/* Background elements for depth */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#AF944F]/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#AF944F]/10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
         </div>
      </Section>
    </div>
  );
}
