import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, 
  CheckCircle2, Sparkles, ShieldCheck, HeartPulse, Info, Star,
  Award, Fingerprint
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays,
  isBefore, startOfDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section, { Container } from '../components/ui/Section';
import { generateSlots, formatDuration } from '../utils/slots';
import useReveal from '../hooks/useReveal';

export default function Agendamento() {
  const { services, addBooking, bookings } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  useReveal();

  const slots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return generateSlots(selectedDate, selectedService.duration, bookings);
  }, [selectedDate, selectedService, bookings]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: '/agendar' } });
      return;
    }
    if (!selectedService || !selectedSlot) return;

    const newBooking = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      datetime: selectedSlot.datetime,
      price: selectedService.price,
      status: 'Confirmado'
    };
    addBooking(newBooking);
    navigate('/usuario', { state: { bookingSuccess: true } });
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen pt-32 pb-32">
      <Container>
        {/* Header Agendamento Luxe */}
        <div className="text-center mb-24 editorial-reveal">
           <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#AF944F]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#AF944F]">Reserva de Atendimento</span>
              <div className="w-12 h-[1px] bg-[#AF944F]" />
           </div>
           <h1 className="text-5xl md:text-8xl font-serif font-black text-[#0F1113] mb-8 tracking-tighter">
             Sua Experiência <br />
             Começa <span className="italic-serif text-[#AF944F]">Agora.</span>
           </h1>
           <p className="text-xl text-gray-400 font-light italic-serif max-w-2xl mx-auto leading-relaxed">
             Selecione o processo desejado e reserve um momento de exclusividade em nossa curadoria.
           </p>
        </div>

        {/* Layout without AnimatePresence for stability - HIGH CONTRAST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: STEP CONTENT */}
           <div className="lg:col-span-8 space-y-12">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-10"
                  >
                     <div className="flex items-center gap-6 mb-10 border-b border-black/5 pb-8 font-black uppercase tracking-tight text-3xl">
                        <div className="w-12 h-12 bg-[#0F1113] text-white rounded-[16px] flex items-center justify-center font-serif shadow-premium">1</div>
                        Escolha o Processo
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.filter(s => s.active).map((s) => (
                           <button 
                             key={s.id} 
                             onClick={() => { 
                               setSelectedService(s); 
                               setStep(2);
                               window.scrollTo({ top: 0, behavior: 'smooth' });
                             }}
                             className={`group relative text-left p-2 rounded-[24px] transition-all duration-700 hover:scale-[1.02] ${selectedService?.id === s.id ? 'ring-2 ring-[#AF944F] ring-offset-8 transition-all' : ''}`}
                           >
                             <Card padding={false} className={`h-full border border-black/5 transition-all duration-500 overflow-hidden shadow-premium hover:shadow-luxe-hover ${selectedService?.id === s.id ? 'bg-[#AF944F]/5 border-[#AF944F]/20' : 'bg-white'}`}>
                                <div className="relative h-48 overflow-hidden">
                                   <img src={s.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={s.name} />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                   <div className="absolute bottom-6 left-6 text-white text-xl font-serif font-black uppercase tracking-widest">{s.name}</div>
                                </div>
                                <div className="p-10">
                                   <p className="text-xs text-gray-500 font-light italic-serif leading-relaxed mb-6 line-clamp-2">{s.description}</p>
                                   <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#AF944F]">
                                         <Clock size={14} /> {formatDuration(s.duration)}
                                      </div>
                                      <span className="text-xl font-serif font-black text-[#0F1113]">R$ {s.price}</span>
                                   </div>
                                </div>
                             </Card>
                           </button>
                        ))}
                     </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-12"
                  >
                     <div className="flex items-center gap-6 mb-10 border-b border-black/5 pb-8 font-black uppercase tracking-tight text-3xl">
                        <button onClick={() => { setStep(1); }} className="p-3 bg-white rounded-xl border border-black/5 hover:bg-black hover:text-white transition-all shadow-premium">
                           <ChevronLeft size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#0F1113] text-white rounded-[16px] flex items-center justify-center font-serif shadow-premium">2</div>
                        Escolha a Data
                     </div>

                     <div className="bg-white p-10 rounded-[24px] shadow-premium border border-black/5">
                        <div className="flex items-center justify-between mb-12 px-2">
                           <h3 className="text-2xl font-serif font-black uppercase tracking-tight">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h3>
                           <div className="flex gap-4">
                              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 hover:bg-gray-100 rounded-xl transition-all border border-black/5"><ChevronLeft size={16} /></button>
                              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 hover:bg-gray-100 rounded-xl transition-all border border-black/5"><ChevronRight size={16} /></button>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-y-6 text-center">
                           {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                              <span key={d} className="text-[10px] font-black tracking-widest text-gray-300 py-4">{d}</span>
                           ))}
                           {days.map(d => {
                              const isPast = isBefore(startOfDay(d), startOfDay(new Date()));
                              const isSelected = isSameDay(d, selectedDate);
                              return (
                                 <button 
                                   key={d.toString()} 
                                   disabled={isPast}
                                   onClick={() => { 
                                     setSelectedDate(d); 
                                     setSelectedSlot(null);
                                     setStep(3);
                                     window.scrollTo({ top: 300, behavior: 'smooth' });
                                   }}
                                   className={`
                                     h-12 w-12 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all relative group
                                     ${!isSameMonth(d, currentMonth) ? 'opacity-10' : ''}
                                     ${isPast ? 'text-gray-200 cursor-not-allowed' : 'hover:scale-110'}
                                     ${isSelected ? 'bg-[#AF944F] text-white shadow-xl scale-110' : 'text-gray-600 hover:bg-gray-50'}
                                   `}
                                 >
                                    {format(d, 'd')}
                                    {isToday(d) && !isSelected && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#AF944F] rounded-full" />}
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-12"
                  >
                     <div className="flex items-center gap-6 mb-10 border-b border-black/5 pb-8 font-black uppercase tracking-tight text-3xl">
                        <button onClick={() => { setStep(2); setSelectedSlot(null); }} className="p-3 bg-white rounded-xl border border-black/5 hover:bg-black hover:text-white transition-all shadow-premium">
                           <ChevronLeft size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#0F1113] text-white rounded-[16px] flex items-center justify-center font-serif shadow-premium">3</div>
                        Escolha o Horário
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {slots.map((s, i) => (
                           <button 
                             key={i} 
                             disabled={!s.available}
                             onClick={() => setSelectedSlot(s)}
                             className={`
                               p-6 rounded-[16px] text-[11px] font-black uppercase tracking-widest border transition-all duration-300
                               ${!s.available ? 'opacity-20 bg-gray-50 text-gray-300 border-transparent strike-through cursor-not-allowed' : 'hover:scale-105 shadow-premium'}
                               ${selectedSlot === s ? 'bg-[#0F1113] text-white border-[#0F1113] shadow-premium' : 'bg-white border-black/5 text-[#0F1113] hover:border-[#AF944F] shadow-premium'}
                             `}
                           >
                              {s.time}
                           </button>
                        ))}
                     </div>
                     {slots.length === 0 && (
                        <div className="p-12 bg-white rounded-[24px] text-center border border-black/5 shadow-premium">
                           <Info className="mx-auto mb-6 text-gray-300" size={32} />
                           <p className="text-gray-400 italic-serif text-sm">Sem horários disponíveis para esta data exclusiva.</p>
                        </div>
                     )}
                  </motion.div>
                )}
           </div>

           {/* RIGHT: SUMMARY SIDEBAR WITH DEPTH - WHITE CARD POP */}
           <div className="lg:col-span-4 sticky top-40">
              <div className="bg-white p-12 rounded-[24px] shadow-premium border border-black/5 space-y-12 editorial-reveal">
                 {/* GISELLE PHOTO INTEGRATION */}
                 <div className="relative -mt-6 -mx-6 mb-12 h-48 rounded-t-[18px] overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop" 
                      className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                      alt="Giselle Soares" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6">
                       <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#AF944F] mb-1">Especialista</p>
                       <p className="text-xl font-serif font-black text-white italic-serif">Giselle Soares</p>
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-4 block">Processo Selecionado</span>
                    <h3 className="text-2xl font-serif font-black uppercase tracking-tight">{selectedService?.name || 'Aguardando Seleção'}</h3>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-black/5">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Data Agendada</span>
                       <span className="text-xs font-black uppercase tracking-widest text-[#0F1113]">
                          {selectedDate 
                             ? format(selectedDate, "dd 'DE' MMMM", { locale: ptBR }) 
                             : '--'}
                       </span>
                    </div>
                    {selectedSlot && (
                       <div className="flex justify-between items-center text-[#AF944F] bg-[#AF944F]/5 p-4 rounded-xl border border-[#AF944F]/20">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Horário Confirmado</span>
                          <span className="text-lg font-serif font-black">{selectedSlot.time}</span>
                       </div>
                    )}
                 </div>

                 <div className="pt-10 border-t-2 border-dashed border-black/5 pb-4">
                    <div className="flex justify-between items-center mb-10">
                       <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#0F1113]">Investimento</span>
                       <span className="text-4xl font-serif font-black text-[#AF944F]">R$ {(selectedService?.price || 0).toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      onClick={handleBooking} 
                      disabled={!selectedService || !selectedSlot} 
                      className="w-full shadow-premium" 
                      variant="primary" 
                      size="xl"
                    >
                      Confirmar Reserva
                    </Button>
                 </div>

                 <div className="bg-[#F5F5F7] p-8 rounded-[20px] flex gap-4 items-start border border-black/5">
                    <ShieldCheck className="text-[#AF944F] shrink-0" size={20} />
                    <p className="text-[10px] text-gray-400 font-light italic-serif leading-relaxed">
                       Sua satisfação e segurança são nossas prioridades absolutas. Equipamentos esterilizados e equipe altamente treinada.
                    </p>
                 </div>
              </div>

              {/* Security Badges */}
              <div className="mt-12 flex justify-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                 <ShieldCheck size={28} />
                 <Star size={28} />
                 <Fingerprint size={28} />
              </div>
           </div>
        </div>
      </Container>
    </div>
  );
}
