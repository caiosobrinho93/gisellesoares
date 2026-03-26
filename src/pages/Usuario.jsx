import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section, { Container } from '../components/ui/Section';
import {
  Calendar, Clock, LogOut, Sparkles, Heart, DollarSign, User, ShieldCheck,
  CheckCircle2, Fingerprint, Gift, Camera, Edit3, Save, X, Eye, EyeOff
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
  const [activeTab, setActiveTab] = useState('agendamentos');
  useReveal();

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
    newPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const fileRef = useRef(null);

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
      setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    }
  };

  const handleSaveProfile = () => {
    const updates = {
      name: profileForm.name || user.name,
      phone: profileForm.phone,
      email: profileForm.email || user.email,
    };

    // Password change: verify current password
    if (profileForm.newPassword) {
      if (profileForm.password !== user.password) {
        setProfileMsg({ type: 'error', text: 'Senha atual incorreta.' });
        return;
      }
      updates.password = profileForm.newPassword;
    }

    updateUser(updates);
    setEditing(false);
    setProfileMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    setTimeout(() => setProfileMsg(null), 4000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const tabs = [
    { id: 'agendamentos', label: 'Meus Agendamentos' },
    { id: 'perfil', label: 'Meu Perfil' },
    { id: 'extras', label: 'Clube Exclusivo' },
  ];

  return (
    <div className="bg-coal min-h-screen pt-32 pb-32 font-sans text-white">
      <Container>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24 editorial-reveal">
          <div className="relative group">
            <div className="w-28 h-28 md:w-48 md:h-48 bg-black text-white rounded-[40px] md:rounded-[48px] flex items-center justify-center text-4xl md:text-8xl font-serif font-black shadow-premium transition-all duration-1000 group-hover:scale-105 overflow-hidden border-4 border-white/5">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                user.name?.[0] || 'U'
              )}
            </div>
            {/* Avatar upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-3 -right-3 w-10 h-10 bg-gold text-coal rounded-2xl flex items-center justify-center shadow-premium hover:scale-110 transition-all border-2 border-coal"
              title="Alterar foto"
            >
              <Camera size={18} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gold rounded-[20px] shadow-premium flex items-center justify-center text-coal border-[4px] border-coal">
              <Sparkles size={16} />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gold bg-gold/5 px-5 py-2 rounded-full border border-gold/10">
                Membro
              </span>
              <div className="flex items-center gap-2 bg-noir text-gold px-5 py-2 rounded-full border border-white/5 shadow-xl w-fit mx-auto md:mx-0">
                <DollarSign size={14} />
                <span className="text-sm font-serif font-black">Saldo: R$ {(user.balance || 0).toFixed(2)}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-9xl font-serif font-black text-white leading-[0.8] mb-6 tracking-tighter">
              Olá, {user.name?.split(' ')[0] || 'Cliente'}<span className="italic-serif text-gold">.</span>
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 items-center">
              <p className="text-sm text-gray-500 font-light italic-serif">
                Membro desde {format(new Date(user.createdAt || Date.now()), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <button onClick={logout} className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 hover:text-red-400 flex items-center gap-2 transition-all">
                SAIR <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Booking Success Banner */}
        {location.state?.bookingSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 p-10 md:p-16 bg-noir text-white rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-premium border border-white/5 relative overflow-hidden"
          >
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <CheckCircle2 size={16} /> Reserva Confirmada
              </div>
              <p className="text-4xl md:text-5xl font-serif font-black text-white mb-3 uppercase tracking-tighter">Agenda Atualizada.</p>
              <p className="text-base text-gray-500 font-light italic-serif">Sua sessão foi reservada. Até breve!</p>
            </div>
            <Button as={Link} to="/agendar" variant="gold" size="xl" className="px-12 shadow-xl relative z-10 hover:scale-105 transition-transform text-[10px] tracking-[0.4em]">Novo Agendamento</Button>
            <Sparkles className="absolute right-[-5%] top-[-10%] text-white/5 w-64 h-64 rotate-12" />
          </motion.div>
        )}

        {/* Profile Message */}
        <AnimatePresence>
          {profileMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-8 p-6 rounded-2xl text-center text-[11px] font-black uppercase tracking-widest ${profileMsg.type === 'success' ? 'bg-green-600/20 text-green-400 border border-green-500/20' : 'bg-red-600/20 text-red-400 border border-red-500/20'}`}
            >
              {profileMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-3 md:gap-6 mb-12 border-b border-white/5 pb-6 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] pb-4 border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === tab.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Meus Agendamentos */}
        {activeTab === 'agendamentos' && (
          <div className="space-y-10">
            {userBookings.filter(b => b.status === 'Confirmado' || b.status === 'Em Andamento').length === 0 ? (
              <div className="text-center p-20 md:p-32 bg-noir rounded-[40px] border border-white/5 shadow-premium">
                <Calendar className="mx-auto text-white/5 mb-8" size={80} strokeWidth={1} />
                <p className="text-gray-500 text-xl mb-10 font-light italic-serif">Você ainda não tem agendamentos ativos.</p>
                <Button as={Link} to="/agendar" variant="gold" size="xl" className="px-12 text-[10px] tracking-[0.4em]">Agendar Agora</Button>
              </div>
            ) : (
              userBookings
                .filter(b => b.status === 'Confirmado' || b.status === 'Em Andamento')
                .map((b, i) => {
                  const canCancel = differenceInHours(new Date(b.datetime), new Date()) >= 6;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card padding={false} className="p-8 md:p-12 hover:shadow-2xl transition-all duration-700 border border-white/5 rounded-[32px] md:rounded-[40px] bg-noir shadow-premium">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full text-gold bg-gold/10 border border-gold/20">
                              {b.status}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase">{b.serviceName}</h3>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
                              <Calendar size={16} className="text-gold shrink-0" />
                              <span className="text-[12px] font-black uppercase tracking-[0.15em] text-white">
                                {b.datetime ? format(new Date(b.datetime), "dd 'de' MMMM", { locale: ptBR }) : '--'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
                              <Clock size={16} className="text-gold shrink-0" />
                              <span className="text-[12px] font-black uppercase tracking-[0.15em] text-gold">
                                {b.datetime ? format(new Date(b.datetime), "HH:mm") : '--'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-6 pt-6 md:pt-0 border-t border-white/5 md:border-0">
                          <div className="text-left md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-1">Total</p>
                            <p className="text-3xl md:text-5xl font-black text-gold">R$ {(b.price || 0).toFixed(0)}</p>
                          </div>
                          {b.status === 'Confirmado' && (
                            <button
                              onClick={() => handleCancel(b.id, b.datetime)}
                              disabled={!canCancel}
                              title={!canCancel ? "Cancelamento apenas com 6h de antecedência" : "Cancelar"}
                              className={`min-h-[44px] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                canCancel
                                  ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                                  : 'border-black/5 text-gray-300 cursor-not-allowed opacity-40'
                              }`}
                            >
                              {canCancel ? 'Cancelar' : 'Bloqueado'}
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: Meu Perfil */}
        {activeTab === 'perfil' && (
          <div className="max-w-2xl">
            <Card padding={false} className="p-10 md:p-12 bg-noir border border-white/5 rounded-[40px] shadow-premium">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-serif font-black text-white">Dados Pessoais</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gold hover:text-white transition-all min-h-[44px] px-4"
                >
                  {editing ? <><X size={16} /> Cancelar</> : <><Edit3 size={16} /> Editar</>}
                </button>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Nome Completo', key: 'name', type: 'text', value: user.name },
                  { label: 'Telefone / WhatsApp', key: 'phone', type: 'tel', value: user.phone || '' },
                  { label: 'E-mail', key: 'email', type: 'email', value: user.email },
                ].map(field => (
                  <div key={field.key} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">{field.label}</label>
                    {editing ? (
                      <input
                        type={field.type}
                        value={profileForm[field.key] || ''}
                        onChange={e => setProfileForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-sans text-white focus:ring-1 focus:ring-gold outline-none transition-all min-h-[48px]"
                      />
                    ) : (
                      <p className="text-base font-sans text-white py-4 px-5 bg-black/20 rounded-2xl border border-white/5">
                        {field.value || <span className="text-gray-600 italic">Não informado</span>}
                      </p>
                    )}
                  </div>
                ))}

                {editing && (
                  <div className="border-t border-white/10 pt-8 space-y-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Alterar Senha (opcional)</p>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Senha Atual</label>
                      <div className="relative">
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={profileForm.password}
                          onChange={e => setProfileForm(p => ({ ...p, password: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm font-sans text-white focus:ring-1 focus:ring-gold outline-none min-h-[48px]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Nova Senha</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={e => setProfileForm(p => ({ ...p, newPassword: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-sans text-white focus:ring-1 focus:ring-gold outline-none min-h-[48px]"
                        placeholder="Nova senha"
                      />
                    </div>
                  </div>
                )}

                {editing && (
                  <Button onClick={handleSaveProfile} variant="gold" size="xl" className="w-full shadow-premium text-[10px] tracking-[0.4em] mt-4 min-h-[56px]">
                    <Save size={18} className="mr-3" /> Salvar Alterações
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tab: Clube Exclusivo / Gift Cards + Esmaltes */}
        {activeTab === 'extras' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gift Card */}
            <Card padding={false} className="p-10 md:p-12 bg-noir border border-white/5 rounded-[40px] shadow-premium">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center rounded-2xl border border-gold/20">
                  <Gift size={24} />
                </div>
                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-gold">Gift Cards</p>
              </div>
              <p className="text-gray-500 font-light mb-8 italic-serif leading-relaxed">
                Transforme seu código em créditos para sua próxima sessão.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                  placeholder="INSIRA SEU CÓDIGO"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-black tracking-[0.4em] uppercase focus:ring-1 focus:ring-gold placeholder:text-white/20 text-white outline-none min-h-[56px]"
                />
                <Button onClick={handleRedeem} variant="secondary" size="xl" className="w-full text-[10px] tracking-[0.4em] min-h-[56px]">
                  Resgatar Agora
                </Button>
              </div>
              <AnimatePresence>
                {redeemStatus && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-6 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center ${redeemStatus.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                  >
                    {redeemStatus.message || redeemStatus.error}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Esmaltes */}
            <Card padding={false} className="p-10 md:p-12 bg-noir border border-white/5 rounded-[40px] shadow-premium">
              <div className="flex items-center gap-5 mb-8">
                <Heart size={28} className="text-gold" />
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Cores Favoritas</p>
              </div>
              <p className="text-gray-500 font-light mb-8 italic-serif leading-relaxed">
                Suas preferências de cor ficam salvas para a profissional saber o que você gosta.
              </p>
              {user.favoriteColors?.length > 0 && (
                <p className="text-[11px] text-gold font-black uppercase tracking-widest mb-6">
                  {user.favoriteColors.length} {user.favoriteColors.length === 1 ? 'cor salva' : 'cores salvas'}
                </p>
              )}
              <Button as={Link} to="/esmaltes" variant="gold" size="xl" className="w-full shadow-premium text-[10px] tracking-[0.4em] min-h-[56px]">
                Ver Catálogo Completo
              </Button>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
