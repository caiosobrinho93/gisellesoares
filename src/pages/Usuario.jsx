import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section, { Container } from '../components/ui/Section';
import { 
  Calendar, Clock, LogOut, Sparkles, Heart, Bell, ChevronLeft, User, ShieldCheck, 
  BarChart3, Users, DollarSign, ArrowUpRight, CheckCircle2, XCircle, Fingerprint
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import useReveal from '../hooks/useReveal';

export default function Usuario() {
  const { user, logout } = useAuth();
  const { getUserBookings, bookings: allBookings = [], getFinancials } = useApp();
  const location = useLocation();
  const [userBookings, setUserBookings] = useState([]);
  useReveal();
  
  const isAdmin = user?.role === 'admin';
  
  const stats = useMemo(() => {
    if (!isAdmin || !getFinancials) return { total: 0, bookings: [] };
    try {
      return getFinancials('month') || { total: 0, bookings: [] };
    } catch (e) {
      return { total: 0, bookings: [] };
    }
  }, [isAdmin, getFinancials]);

  useEffect(() => {
    if (user && !isAdmin && getUserBookings) {
      setUserBookings(getUserBookings(user.id) || []);
    }
  }, [user, isAdmin, getUserBookings]);

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
                 {isAdmin ? <ShieldCheck size={28} /> : <Sparkles size={28} />}
              </div>
           </div>
           <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                 <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#AF944F] block">
                    {isAdmin ? 'Gestão Administrativa' : 'Membro Exclusivo'}
                 </span>
                 {isAdmin && <span className="bg-[#AF944F]/10 text-[#AF944F] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#AF944F]/20 w-fit mx-auto md:mx-0 shadow-sm">Privilégio Gold</span>}
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-[#0F1113] leading-none mb-8 tracking-tighter">
                Olá, {user.name?.split(' ')[0] || 'Cliente'}<span className="italic-serif text-[#AF944F]">.</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-10 items-center">
                 <p className="text-sm text-gray-400 font-light italic-serif">Curadoria iniciada em {format(new Date(user.createdAt || Date.now()), "MMMM yyyy", { locale: ptBR })}</p>
                 <div className="h-6 w-[1.5px] bg-black/10 hidden md:block" />
                 <button onClick={logout} className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-red-500 hover:tracking-[0.6em] transition-all flex items-center gap-2 group">
                    Encerrar Ritual <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
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
              <p className="text-4xl font-serif font-black text-[#AF944F] mb-4 uppercase tracking-tight">Ritual Agendado.</p>
              <p className="text-lg text-gray-400 font-light italic-serif">Sua experiência foi reservada e está sob nossa curadoria.</p>
            </div>
            <Button as={Link} to="/agendar" variant="primary" size="xl" className="px-16 shadow-premium relative z-10">Agendar Outro</Button>
            <Sparkles className="absolute right-10 top-10 text-gray-50 w-64 h-64 -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
          </motion.div>
        )}

        {/* ADMIN VIEW */}
        {isAdmin ? (
          <div className="space-y-24 editorial-reveal">
            {/* Quick Stats - WHITE CARD POP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { label: 'Faturamento Mensal', value: `R$ ${(stats?.total || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
                 { label: 'Total de Atendimentos', value: allBookings.length, icon: Calendar, color: 'text-[#AF944F]' },
                 { label: 'Clientes Ativos', value: '12', icon: Users, color: 'text-blue-600' }
               ].map((stat, i) => (
                 <Card key={i} padding={false} className="p-12 flex items-center gap-10 bg-white border border-black/5 hover:border-[#AF944F]/40 transition-all shadow-premium rounded-[24px]">
                    <div className={`w-20 h-20 rounded-[20px] bg-[#F5F5F7] flex items-center justify-center ${stat.color} shadow-sm border border-black/5`}>
                       <stat.icon size={28} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 mb-2">{stat.label}</p>
                       <p className="text-4xl font-serif font-black text-[#0F1113] tracking-tighter">{stat.value}</p>
                    </div>
                 </Card>
               ))}
            </div>

            {/* Management Table */}
            <div className="space-y-12">
               <div className="flex items-center justify-between border-b border-black/5 pb-12">
                  <h2 className="text-5xl font-serif font-black tracking-tight uppercase">Gestão Operacional</h2>
                  <Button variant="outline" size="md" className="shadow-premium border-black/10">Exportar Relatório</Button>
               </div>
               
               <div className="bg-white rounded-[24px] border border-black/10 shadow-premium overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-black/5 bg-[#F5F5F7]">
                             <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 whitespace-nowrap">Cliente</th>
                             <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 whitespace-nowrap">Serviço</th>
                             <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 whitespace-nowrap">Data & Hora</th>
                             <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 text-right whitespace-nowrap">Valor</th>
                             <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 text-center whitespace-nowrap">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-black/5">
                          {allBookings.map((b) => (
                             <tr key={b.id} className="hover:bg-[#F5F5F7] transition-colors group">
                                <td className="px-12 py-10">
                                   <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 bg-[#0F1113] text-white rounded-[16px] flex items-center justify-center font-serif font-black text-sm shadow-premium">{b.userName?.[0] || 'C'}</div>
                                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F1113]">{b.userName || 'Cliente'}</p>
                                   </div>
                                </td>
                                <td className="px-12 py-10 text-base font-light italic-serif text-gray-500">{b.serviceName}</td>
                                <td className="px-12 py-10">
                                   <p className="text-[11px] font-black uppercase tracking-widest text-[#0F1113]">{b.datetime ? format(new Date(b.datetime), "dd/MM/yyyy") : '--'}</p>
                                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#AF944F]">{b.datetime ? format(new Date(b.datetime), "HH:mm") : '--'}</p>
                                </td>
                                <td className="px-12 py-10 text-right font-serif font-black text-[#0F1113] text-xl">R$ {(b.price || 0).toFixed(2)}</td>
                                <td className="px-12 py-10">
                                   <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-green-100 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                      {b.status === 'Confirmado' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                      {b.status || 'Confirmado'}
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                    {allBookings.length === 0 && (
                       <div className="p-32 text-center">
                          <p className="text-gray-300 italic-serif text-2xl">Nenhum registro operacional encontrado.</p>
                       </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          /* USER VIEW (Client) - WHITE CARD POP */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-16">
              <div className="flex items-center gap-8 mb-4 border-b border-black/5 pb-10">
                 <h2 className="text-5xl font-serif font-black tracking-tight uppercase">Meus Rituais</h2>
                 <div className="flex-1" />
                 <Button as={Link} to="/agendar" variant="gold" size="md" className="shadow-premium">Novo Ritual</Button>
              </div>
              
              {userBookings.length === 0 ? (
                <div className="text-center p-32 bg-white rounded-[24px] border border-black/5 shadow-premium editorial-reveal">
                  <Calendar className="mx-auto text-gray-100 mb-10" size={80} strokeWidth={1} />
                  <p className="text-gray-400 text-xl mb-12 font-light italic-serif">Nenhum cuidado reservado no momento.</p>
                  <Button as={Link} to="/agendar" variant="primary" size="lg">Iniciar Experiência</Button>
                </div>
              ) : (
                userBookings.map((b, i) => (
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
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#AF944F]">Ritual Selecionado</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
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
                          <button className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 hover:text-red-600 transition-all border-b border-transparent hover:border-red-600 pb-1">Cancelar Ritual</button>
                        </div>
                      </div>
                      <Fingerprint className="absolute -bottom-10 -right-10 text-black/5 w-48 h-48 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar: Profile Details - WHITE CARD POP */}
            <div className="lg:col-span-4 space-y-16">
              <h2 className="text-3xl font-serif font-black uppercase tracking-tight mb-8">Preferências Elite</h2>
              <div className="space-y-10 sticky top-40">
                 <Card padding={false} className="p-12 bg-white border border-black/5 space-y-16 shadow-premium rounded-[24px]">
                    <div className="editorial-reveal">
                       <div className="flex items-center gap-5 mb-8">
                          <Heart size={24} className="text-[#AF944F]" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em]">Curadoria de Cores</p>
                       </div>
                       <p className="text-base text-gray-500 font-light mb-12 italic-serif leading-relaxed">
                         Defina seu tom favorito para que possamos personalizar sua experiência antes mesmo da sua chegada.
                       </p>
                       <Button as={Link} to="/esmaltes" variant="gold" size="lg" className="w-full shadow-premium">Explorar Catálogo</Button>
                    </div>
                    
                    <div className="pt-12 border-t border-black/5 editorial-reveal">
                       <div className="flex items-center gap-5 mb-8">
                          <ShieldCheck size={24} className="text-[#AF944F]" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em]">Biossegurança</p>
                       </div>
                       <p className="text-sm text-gray-400 font-light italic-serif leading-relaxed mb-8">
                         Seguimos rigorosos métodos de esterilização hospitalar para garantir sua total segurança.
                       </p>
                    </div>
                 </Card>

                 <div className="bg-[#0F1113] p-12 rounded-[24px] text-white overflow-hidden relative group editorial-reveal shadow-premium">
                    <div className="relative z-10">
                       <Sparkles size={32} className="text-[#AF944F] mb-8" />
                       <h3 className="text-2xl font-serif font-black mb-6 uppercase tracking-tight">Gift Card Luxe</h3>
                       <p className="text-sm font-light text-gray-400 mb-10 italic-serif leading-relaxed">Presenteie com um momento de puro requinte e cuidado exclusivo.</p>
                       <Button variant="secondary" size="md" className="w-full shadow-premium">Adquirir Agora</Button>
                    </div>
                    <Fingerprint className="absolute -bottom-12 -right-12 text-white/5 w-48 h-48 group-hover:scale-110 transition-transform duration-1000" />
                 </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
