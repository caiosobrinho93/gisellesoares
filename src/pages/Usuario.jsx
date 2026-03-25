import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
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
  const { user, logout } = useAuth();
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
    <div className="bg-[#F5F5F7] min-h-screen pt-32 pb-32">
      <Container>
        {/* Profile Header Luxe - HIGH CONTRAST */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24 editorial-reveal">
           <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-[#0F1113] text-white rounded-[40px] flex items-center justify-center text-5xl md:text-7xl font-serif font-black shadow-premium transition-all duration-700 group-hover:scale-105 group-hover:rotate-3 overflow-hidden border-4 border-white/10">
                {user.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#AF944F] rounded-[20px] shadow-premium flex items-center justify-center text-white border-[6px] border-[#F5F5F7]">
                 <Sparkles size={28} />
              </div>
           </div>
           <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                 <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#AF944F] block">
                    Membro Exclusivo
                 </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-[#0F1113] leading-none mb-8 tracking-tighter">
                Olá, {user.name?.split(' ')[0] || 'Cliente'}<span className="italic-serif text-[#AF944F]">.</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-10 items-center">
                 <p className="text-sm text-gray-400 font-light italic-serif">Curadoria iniciada em {format(new Date(user.createdAt || Date.now()), "MMMM yyyy", { locale: ptBR })}</p>
                 <div className="h-6 w-[1.5px] bg-black/10 hidden md:block" />
                 <button onClick={logout} className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-red-500 hover:tracking-[0.6em] transition-all flex items-center gap-2 group">
                    Sair da Conta <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>

        {/* STATUS / NOTIFICATION */}
        {location.state?.bookingSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 p-12 md:p-16 bg-white text-[#0F1113] rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-12 shadow-premium border border-black/5 relative overflow-hidden group"
          >
            <div className="relative z-10 text-center md:text-left">
              <p className="text-4xl font-serif font-black text-[#AF944F] mb-4 uppercase tracking-tight">Atendimento Agendado.</p>
              <p className="text-lg text-gray-400 font-light italic-serif">Sua experiência foi reservada e está sob nossa curadoria.</p>
            </div>
            <Button as={Link} to="/agendar" variant="primary" size="xl" className="px-16 shadow-premium relative z-10">Agendar Outro</Button>
            <Sparkles className="absolute right-10 top-10 text-gray-50 w-64 h-64 -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
          </motion.div>
        )}

        {/* USER VIEW (Client) - WHITE CARD POP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-center gap-8 mb-4 border-b border-black/5 pb-10">
               <h2 className="text-5xl font-serif font-black tracking-tight uppercase">Meus Agendamentos</h2>
               <div className="flex-1" />
               <Button as={Link} to="/agendar" variant="gold" size="md" className="shadow-premium">Novo Agendamento</Button>
            </div>
            
            {userBookings.length === 0 ? (
              <div className="text-center p-32 bg-white rounded-[24px] border border-black/5 shadow-premium editorial-reveal">
                <Calendar className="mx-auto text-gray-100 mb-10" size={80} strokeWidth={1} />
                <p className="text-gray-400 text-xl mb-12 font-light italic-serif">Nenhum cuidado reservado no momento.</p>
                <Button as={Link} to="/agendar" variant="primary" size="lg">Iniciar Experiência</Button>
              </div>
            ) : (
              userBookings.map((b, i) => {
                const canCancel = differenceInHours(new Date(b.datetime), new Date()) >= 6;
                return (
                  <motion.div 
                    key={b.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card padding={false} className="p-12 hover:shadow-luxe-hover transition-all duration-700 overflow-hidden border border-black/5 group relative rounded-[24px] bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                        <div className="flex-1 relative z-10">
                          <div className="flex items-center gap-6 mb-8">
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#AF944F]">Atendimento Selecionado</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${b.status === 'cancelado' ? 'bg-red-500' : 'bg-green-500 animate-pulse'} shadow-sm`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">{b.status}</span>
                          </div>
                          <h3 className="text-4xl font-serif font-black text-[#0F1113] mb-8 tracking-tighter group-hover:text-[#AF944F] transition-colors">{b.serviceName}</h3>
                          <div className="flex flex-wrap gap-12">
                            <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-xl shadow-sm border border-black/5">
                               <Calendar size={22} className="text-[#AF944F]" />
                               <span className="text-[11px] font-black uppercase tracking-[0.2em]">{b.datetime ? format(new Date(b.datetime), "dd 'de' MMMM", { locale: ptBR }) : '--'}</span>
                            </div>
                            <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-xl shadow-sm border border-black/5">
                               <Clock size={22} className="text-[#AF944F]" />
                               <span className="text-[11px] font-black uppercase tracking-[0.2em]">{b.datetime ? format(new Date(b.datetime), "HH:mm") : '--'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-8 min-w-[180px] pt-12 md:pt-0 border-t md:border-t-0 border-black/5 w-full md:w-auto relative z-10">
                          <p className="text-5xl font-serif font-black text-[#0F1113]">R$ {(b.price || 0).toFixed(2)}</p>
                          {b.status !== 'cancelado' && (
                            <button 
                              onClick={() => handleCancel(b.id, b.datetime)}
                              className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all border-b border-transparent pb-1 ${canCancel ? 'text-gray-300 hover:text-red-600 hover:border-red-600' : 'text-gray-200 cursor-not-allowed opacity-50'}`}
                              title={!canCancel ? "Cancelamento permitido apenas com 6h de antecedência" : ""}
                            >
                              Cancelar Atendimento
                            </button>
                          )}
                        </div>
                      </div>
                      <Fingerprint className="absolute -bottom-10 -right-10 text-black/5 w-48 h-48 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Sidebar: Profile Details - WHITE CARD POP */}
          <div className="lg:col-span-4 space-y-16">
            <h2 className="text-3xl font-serif font-black uppercase tracking-tight mb-8">Benefícios & Mimos</h2>
            <div className="space-y-10 sticky top-40">
               {/* GIFT CARD REDEEM SECTION */}
               <Card padding={false} className="p-12 bg-[#0F1113] text-white border border-black/5 space-y-10 shadow-premium rounded-[24px] overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                        <Gift size={24} className="text-[#AF944F]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#AF944F]">Resgatar Gift Card</p>
                    </div>
                    <p className="text-sm text-gray-400 font-light mb-8 italic-serif leading-relaxed">
                      Insira o código exclusivo para adicionar créditos à sua conta.
                    </p>
                    
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={giftCode}
                         onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                         placeholder="CÓDIGO"
                         className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#AF944F]"
                       />
                       <Button onClick={handleRedeem} variant="secondary" size="md">OK</Button>
                    </div>

                    <AnimatePresence>
                       {redeemStatus && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${redeemStatus.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {redeemStatus.message || redeemStatus.error}
                         </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                  <Fingerprint className="absolute -bottom-12 -right-12 text-white/5 w-48 h-48 group-hover:scale-110 transition-transform duration-1000" />
               </Card>

               <Card padding={false} className="p-12 bg-white border border-black/5 space-y-16 shadow-premium rounded-[24px]">
                  <div className="editorial-reveal">
                     <div className="flex items-center gap-5 mb-8">
                        <Heart size={24} className="text-[#AF944F]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">Curadoria de Cores</p>
                     </div>
                     <p className="text-base text-gray-500 font-light mb-12 italic-serif leading-relaxed">
                       Escolha seus tons favoritos para personalizarmos seu atendimento.
                     </p>
                     <Button as={Link} to="/esmaltes" variant="gold" size="lg" className="w-full shadow-premium">Explorar Catálogo</Button>
                  </div>
                  
                  <div className="pt-12 border-t border-black/5 editorial-reveal">
                     <div className="flex items-center gap-5 mb-8">
                        <ShieldCheck size={24} className="text-[#AF944F]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">Biossegurança</p>
                     </div>
                     <p className="text-sm text-gray-400 font-light italic-serif leading-relaxed">
                       Ambiente rigorosamente esterilizado para sua tranquilidade e conforto.
                     </p>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
