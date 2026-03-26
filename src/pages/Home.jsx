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
    <div className="bg-black">
      {/* HERO: NOIR LUXE */}
      <section className="relative min-h-[95vh] flex items-center bg-black overflow-hidden selection:bg-gold/30">
        <div className="container-luxe relative z-10 py-16 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ duration: 1, ease: [0.2, 1, 0.2, 1] }}
             >
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-12 h-[1px] bg-gold/50" />
                   <span className="text-[12px] font-black uppercase tracking-[0.6em] text-gold/80">Noir Edition</span>
                </div>
                <h1 className="text-5xl md:text-9xl font-serif font-black text-white leading-[0.85] mb-12 tracking-tighter">
                   Curadoria <br />
                   de <span className="italic-serif">Beleza</span>.
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-400 max-w-xl leading-relaxed mb-16 italic-serif">
                   Onde a precisão técnica encontra o luxo absoluto. Redefinimos o cuidado com um olhar Noir e curadoria milimétrica.
                </p>
                <div className="flex flex-col sm:flex-row gap-8">
                   <Button as={Link} to="/agendar" variant="secondary" size="xl" className="shadow-luxe h-20 px-12 text-[10px] tracking-[0.5em]">RESERVAR EXPERIÊNCIA</Button>
                   <Button as={Link} to="/galeria" variant="outline" size="xl" className="border-white/10 text-white hover:bg-white hover:text-black h-20 px-12 text-[10px] tracking-[0.5em]">GALERIA NOIR</Button>
                </div>
             </motion.div>
             <div className="hidden lg:block relative">
                <motion.div 
                   initial={{ opacity: 0, scale: 1.1 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="relative"
                >
                   <div className="absolute -inset-4 border border-gold/20 rounded-[40px] translate-x-6 translate-y-6 -z-10" />
                   <img 
                     src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop" 
                     className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-luxe grayscale-[0.3] brightness-75 hover:grayscale-0 transition-all duration-1000" 
                     alt="Estética" 
                   />
                </motion.div>
                <div className="absolute -bottom-10 -left-10 bg-noir border border-white/5 p-10 rounded-3xl shadow-2xl backdrop-blur-xl editorial-reveal visible delay-500">
                   <p className="text-4xl font-serif font-black text-gold mb-1">0%</p>
                   <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Erros Técnicos</p>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/[0.03] blur-[150px] rounded-full translate-x-1/2 -z-0" />
      </section>

      {/* PHILOSOPHY: DARK NOIR */}
      <Section background="bg-black">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="editorial-reveal relative group">
               <img 
                 src="https://images.unsplash.com/photo-1632345031435-07ca681582d1?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full aspect-[16/10] object-cover rounded-[32px] shadow-luxe grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000" 
                 alt="Biossegurança" 
               />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-1000 rounded-[32px]" />
            </div>
            <div className="editorial-reveal">
               <div className="p-2 md:p-8">
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] text-gold mb-8 block">CURADORIA NOIR</span>
                  <h2 className="text-6xl md:text-8xl mb-12 leading-[0.9] text-white">O Rigor da <br /><span className="italic-serif">Perfeição</span>.</h2>
                  <p className="text-2xl text-gray-400 font-light leading-relaxed mb-16 italic-serif">
                    Protocolos hospitalares de esterilização fundidos com a sofisticação da cuticulagem a seco. O luxo que respeita sua saúde.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { icon: ShieldCheck, text: "Biossegurança Total" },
                      { icon: Award, text: "Técnica Russa" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-noir border border-white/5 shadow-premium group hover:border-gold/30 transition-all">
                         <div className="w-12 h-12 flex items-center justify-center text-gold bg-gold/5 rounded-xl">
                            <item.icon size={24} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
         </div>
      </Section>

      {/* DYNAMIC SERVICES: NOIR CATALOG */}
      <Section background="bg-black">
         <div className="flex flex-col md:flex-row justify-between items-end mb-32 editorial-reveal gap-12">
            <div className="max-w-2xl text-left">
               <span className="text-[12px] font-black uppercase tracking-[0.5em] text-gold mb-6 block">CATÁLOGO EXCLUSIVO</span>
               <h2 className="text-6xl md:text-9xl font-serif font-black tracking-tighter text-white">Nossas <span className="italic-serif">Artes</span>.</h2>
            </div>
            <div className="pb-4">
               <p className="text-xl text-gray-500 font-light italic-serif">Experiências curadas para elevar seu padrão.</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {services.length > 0 ? services.map((s, i) => (
               <motion.div 
                 key={s.id}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 1, ease: [0.2, 1, 0.2, 1] }}
                 className="group relative flex flex-col h-full"
               >
                 <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-10 shadow-luxe bg-noir">
                    <img 
                      src={s.image} 
                      alt={s.name} 
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 brightness-75 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 border border-white/5 rounded-[32px] transition-all group-hover:border-gold/30" />
                    
                    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                       <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-2">Procedimento Noir</p>
                          <h3 className="text-3xl font-serif font-black text-white leading-tight">{s.name}</h3>
                       </div>
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
                          <p className="text-gold text-[12px] font-black tracking-widest whitespace-nowrap">R$ {s.price}</p>
                       </div>
                    </div>
                 </div>

                 <div className="px-4 flex flex-col flex-1">
                    <p className="text-gray-500 text-lg font-light leading-relaxed mb-10 italic-serif line-clamp-2">
                       {s.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto pb-4">
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#AF944F]/60">
                          <Clock size={14} className="text-gold" /> {formatDuration(s.duration)}
                       </div>
                       <Link to="/agendar" className="text-white hover:text-gold transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] group/link">
                          Reservar <ChevronRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                       </Link>
                    </div>
                 </div>
               </motion.div>
            )) : (
               <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-[32px] text-gray-500 italic-serif">
                  Aguardando curadoria de serviços...
               </div>
            )}
         </div>
      </Section>

      {/* CTA: TOTAL NOIR */}
      <Section background="bg-black">
         <div className="bg-noir p-16 md:p-40 rounded-[48px] text-center editorial-reveal border border-white/5 relative overflow-hidden group shadow-luxe">
            <div className="relative z-10 flex flex-col items-center">
               <Fingerprint className="mb-12 text-gold opacity-50 transition-opacity group-hover:opacity-100 duration-1000" size={64} strokeWidth={0.5} />
               <h2 className="text-6xl md:text-[10rem] font-serif font-black text-white mb-12 tracking-tighter leading-[0.8]">Noir.<span className="italic-serif text-gold"> Luxe.</span></h2>
               <p className="text-2xl md:text-3xl font-light text-gray-400 mb-20 max-w-3xl mx-auto italic-serif leading-relaxed px-4">
                  Sinta a curadoria exclusiva onde cada movimento é planejado para sua satisfação absoluta.
               </p>
               <Button as={Link} to="/agendar" variant="secondary" size="xl" className="shadow-2xl h-24 px-20 text-[12px] tracking-[0.6em] hover:scale-105 transition-transform">SOLICITAR CONVITE</Button>
            </div>
            
            {/* Visual Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/[0.02] blur-[150px] rounded-full" />
            <div className="absolute top-0 right-0 p-12 text-[150px] font-serif font-black text-white/[0.02] select-none translate-x-1/3 -translate-y-1/3 italic pointer-events-none">G.S</div>
         </div>
      </Section>
    </div>
  );
}
