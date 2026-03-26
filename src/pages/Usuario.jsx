import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import NeoButton from '../components/ui/NeoButton';
import Card from '../components/ui/Card';
import Section, { Container } from '../components/ui/Section';
import { 
  Calendar, Clock, LogOut, Sparkles, Heart, Bell, ChevronLeft, User, ShieldCheck, 
  BarChart3, Users, DollarSign, ArrowUpRight, CheckCircle2, XCircle, Fingerprint, Gift
} from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import useReveal from '../hooks/useReveal';

export default function Usuario() {
  const { user, logout, updateUser } = useAuth();
  const { getUserBookings, cancelBooking, redeemGiftCard } = useApp();
  const location = useLocation();
  const [userBookings, setUserBookings] = useState([]);
  const [giftCode, setGiftCode] = useState('');
  const [redeemStatus, setRedeemStatus] = useState(null);
  useReveal();

  useEffect(() => {
    if (user && getUserBookings) {
      setUserBookings(getUserBookings(user.id) || []);
    }
  }, [user, getUserBookings]);

  const handleRedeem = () => {
    if (!giftCode) return;
    const result = redeemGiftCard(giftCode, user.id);
    setRedeemStatus(result);
    if (result.success) {
      updateUser({ balance: (user.balance || 0) + result.amount });
      setGiftCode('');
      setTimeout(() => setRedeemStatus(null), 5000);
    }
  };

  const handleCancel = (bookingId, datetime) => {
    const hoursDiff = differenceInHours(new Date(datetime), new Date());
    if (hoursDiff < 6) {
      alert('Cancelamentos só são permitidos com no mínimo 6h de antecedência.');
      return;
    }
    if (window.confirm('Tem certeza que deseja cancelar este atendimento?')) {
      cancelBooking(bookingId);
      setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelado' } : b));
    }
  };

  if (!user) return null;

  return (
    <div className="bg-coal min-h-screen pt-32 pb-32 font-sans text-white">
      <Container>
        {/* Profile Header Luxe - NOIR */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24 editorial-reveal">
           <div className="relative group">
              <div className="w-32 h-32 md:w-56 md:h-56 bg-black text-white rounded-[48px] flex items-center justify-center text-5xl md:text-8xl font-serif font-black shadow-premium transition-all duration-1000 group-hover:scale-105 group-hover:rotate-2 overflow-hidden border-4 border-white/5">
                {user.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gold rounded-[24px] shadow-premium flex flex-col items-center justify-center text-coal border-[6px] border-coal">
                 <span className="text-[8px] font-black uppercase tracking-widest leading-none mb-1 text-black">CASH</span>
                 <Sparkles size={24} className="text-black" />
              </div>
           </div>
           <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gold bg-gold/5 px-6 py-2 rounded-full border border-gold/10">
                    Membro Noir Luxe
                 </span>
                 <div className="flex items-center gap-2 bg-noir text-gold px-6 py-2 rounded-full border border-white/5 shadow-xl">
                    <DollarSign size={14} />
                    <span className="text-sm font-serif font-black">Saldo: R$ {(user.balance || 0).toFixed(2)}</span>
                 </div>
              </div>
              <h1 className="text-6xl md:text-9xl font-serif font-black text-white leading-[0.8] mb-10 tracking-tighter">
                Olá, {user.name?.split(' ')[0] || 'Cliente'}<span className="italic-serif text-gold">.</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-12 items-center">
                 <p className="text-sm text-gray-500 font-light italic-serif leading-relaxed">Membro da curadoria desde {format(new Date(user.createdAt || Date.now()), "MMMM 'de' yyyy", { locale: ptBR })}</p>
                 <div className="hidden md:block w-12 h-[1px] bg-white/5" />
                 <button onClick={logout} className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 hover:text-red-400 hover:tracking-[0.6em] transition-all flex items-center gap-3">
                    SAIR DA CONTA <LogOut size={16} />
                 </button>
              </div>
           </div>
        </div>

        {/* STATUS / NOTIFICATION */}
        {location.state?.bookingSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-24 p-12 md:p-20 bg-noir text-white rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-12 shadow-premium border border-white/5 relative overflow-hidden group"
          >
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                 <CheckCircle2 size={16} /> Reserva Confirmada
              </div>
              <p className="text-5xl font-serif font-black text-white mb-4 uppercase tracking-tighter">Agenda Atualizada.</p>
              <p className="text-lg text-gray-500 font-light italic-serif max-w-xl">Sua experiência Noir Luxe foi reservada com sucesso. Nossa equipe já está preparando sua chegada.</p>
            </div>
            <Button as={Link} to="/agendar" variant="gold" size="xl" className="px-20 shadow-2xl relative z-10 hover:scale-105 transition-transform h-20 text-[10px] tracking-[0.4em]">Novo Agendamento</Button>
            <Sparkles className="absolute right-[-5%] top-[-10%] text-white/5 w-80 h-80 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </motion.div>
        )}

        {/* USER VIEW (Client) - WHITE CARD POP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-center gap-8 mb-10 border-b border-white/5 pb-10">
               <h2 className="text-4xl font-serif font-black tracking-tighter uppercase whitespace-nowrap">Meus <span className="italic-serif text-gold">Cuidados</span></h2>
               <div className="flex-1" />
               <Button as={Link} to="/agendar" variant="outline" size="md" className="hidden sm:flex rounded-full border-white/10 text-white hover:bg-white hover:text-black">Histórico Completo</Button>
            </div>
            
            {userBookings.length === 0 ? (
              <div className="text-center p-32 bg-noir rounded-[48px] border border-white/5 shadow-premium">
                <Calendar className="mx-auto text-white/5 mb-10" size={100} strokeWidth={1} />
                <p className="text-gray-500 text-2xl mb-12 font-light italic-serif">Você ainda não viveu a experiência Noir Luxe.</p>
                <Button as={Link} to="/agendar" variant="gold" size="xl" className="px-16 text-[10px] tracking-[0.4em]">Reservar Agora</Button>
              </div>
            ) : (
              <div className="space-y-10">
                {userBookings.map((b, i) => {
                  const canCancel = differenceInHours(new Date(b.datetime), new Date()) >= 6;
                  return (
                    <motion.div 
                      key={b.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card padding={false} className="p-12 hover:shadow-2xl transition-all duration-700 overflow-hidden border border-white/5 group relative rounded-[40px] bg-noir">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                          <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                              <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-full ${b.status === 'Cancelado' ? 'bg-red-500/10 text-red-500' : 'bg-gold/10 text-gold'}`}>
                                {b.status === 'Cancelado' ? 'Cancelado' : 'Próximo Atendimento'}
                              </span>
                              {b.status !== 'Cancelado' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                            </div>
                            <h3 className="text-5xl font-serif font-black text-white mb-10 tracking-tighter group-hover:text-gold transition-all duration-700">{b.serviceName}</h3>
                            <div className="flex flex-wrap gap-6">
                              <div className="flex items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-sm">
                                 <Calendar size={20} className="text-gold" />
                                 <span className="text-[12px] font-black uppercase tracking-[0.2em]">{b.datetime ? format(new Date(b.datetime), "dd 'de' MMMM", { locale: ptBR }) : '--'}</span>
                              </div>
                              <div className="flex items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-sm">
                                 <Clock size={20} className="text-gold" />
                                 <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gold">{b.datetime ? format(new Date(b.datetime), "HH:mm") : '--'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-10 min-w-[220px] pt-12 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto relative z-10">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Valor Estimado</p>
                               <p className="text-6xl font-serif font-black text-white">R$ {(b.price || 0).toFixed(0)}</p>
                            </div>
                            {b.status !== 'Cancelado' && (
                              <NeoButton 
                                onClick={() => handleCancel(b.id, b.datetime)}
                                disabled={!canCancel}
                                className={!canCancel ? 'opacity-30 grayscale cursor-not-allowed' : ''}
                                title={!canCancel ? "Cancelamento apenas com 6h de antecedência" : ""}
                              >
                                {canCancel ? 'CANCELAR' : 'BLOQUEADO'}
                              </NeoButton>
                            )}
                          </div>
                        </div>
                        <Fingerprint className="absolute -bottom-16 -right-16 text-white/5 w-64 h-64 opacity-0 group-hover:opacity-100 transition-all duration-1000 rotate-12" />
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Profile Details - WHITE CARD POP */}
          <div className="lg:col-span-4 space-y-16">
            <h2 className="text-3xl font-serif font-black uppercase tracking-tight mb-10 text-white">Clube <span className="italic-serif text-gold">Exclusivo</span></h2>
            <div className="space-y-12 sticky top-40">
               {/* GIFT CARD REDEEM SECTION */}
               <Card padding={false} className="p-12 bg-noir text-white space-y-12 shadow-2xl rounded-[48px] overflow-hidden relative group border border-white/5">
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-14 h-14 bg-gold/10 text-gold flex items-center justify-center rounded-2xl border border-gold/20">
                           <Gift size={28} />
                        </div>
                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-gold">Gift Cards</p>
                    </div>
                    <p className="text-base text-gray-500 font-light mb-10 italic-serif leading-relaxed">
                      Transforme seu código exclusivo em créditos para sua próxima sessão de autocuidado.
                    </p>
                    
                    <div className="space-y-4">
                       <input 
                         type="text" 
                         value={giftCode}
                         onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                         placeholder="INSIRA SEU CÓDIGO"
                         className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black tracking-[0.4em] uppercase focus:ring-1 focus:ring-gold placeholder:text-white/20 text-white"
                       />
                       <Button onClick={handleRedeem} variant="secondary" size="xl" className="w-full text-[10px] tracking-[0.5em] h-20 shadow-xl">RESGATAR AGORA</Button>
                    </div>

                    <AnimatePresence>
                       {redeemStatus && (
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center shadow-2xl ${redeemStatus.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {redeemStatus.message || redeemStatus.error}
                         </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                  <Sparkles className="absolute -bottom-20 -left-20 text-white/5 w-64 h-64 group-hover:scale-110 transition-transform duration-1000" />
               </Card>

               <Card padding={false} className="p-12 bg-noir border border-white/5 space-y-12 shadow-premium rounded-[48px] overflow-hidden group">
                  <div className="relative z-10">
                     <div className="flex items-center gap-6 mb-8">
                        <Heart size={28} className="text-gold" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Paleta Noir</p>
                     </div>
                     <p className="text-lg text-gray-500 font-light mb-12 italic-serif leading-relaxed">
                       Sua curadoria de tons preferida para uma experiência sob medida.
                     </p>
                     <Button as={Link} to="/esmaltes" variant="gold" size="xl" className="w-full shadow-premium text-[10px] tracking-[0.4em] h-20">CATÁLOGO COMPLETO</Button>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
