import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, Users, Calendar, Settings, LogOut, 
  Menu, X, Search, Bell, Filter, ChevronDown, 
  MoreHorizontal, Plus, Download, Sparkles, LayoutDashboard,
  Gift, Image as ImageIcon, Trash2, Edit2, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Admin() {
  const { user, logout } = useAuth();
  const { 
    bookings, services, gallery, giftCards, getAllUsers, 
    updateBooking, deleteBooking, addService, updateService, deleteService,
    addGiftCard, deleteGiftCard, addGalleryImage, deleteGalleryImage,
    getFinancials
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [isAddingGiftCard, setIsAddingGiftCard] = useState(false);
  
  const users = getAllUsers();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'giftcards', label: 'Gift Cards', icon: Gift },
    { id: 'servicos', label: 'Serviços', icon: Settings },
    { id: 'galeria', label: 'Galeria', icon: ImageIcon },
  ];

  const financialStats = getFinancials('month');

  const stats = [
    { label: 'Clientes Totais', value: users.length, change: '+12%', icon: Users },
    { label: 'Agendamentos', value: bookings.length, change: '+5%', icon: Calendar },
    { label: 'Faturamento Mensal', value: `R$ ${financialStats.total.toFixed(2)}`, change: '+18%', icon: BarChart3 },
    { label: 'Gift Cards Ativos', value: giftCards.filter(c => c.status === 'active').length, change: 'New', icon: Sparkles },
  ];

  // --- Sub-components for Sections ---

  const DashboardSection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <div key={i} className="p-10 border border-white/5 hover:border-gold/30 transition-all duration-700 bg-noir group rounded-[32px] shadow-premium">
            <div className="flex justify-between items-start mb-8 text-gray-500 group-hover:text-gold transition-colors">
              <s.icon size={20} />
              <span className="text-[10px] font-black font-sans text-gold">{s.change}</span>
            </div>
            <p className="text-[10px] font-black font-sans uppercase tracking-[0.4em] text-gray-500 mb-2">{s.label}</p>
            <p className="text-4xl font-serif font-black tracking-tighter text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="bg-noir p-10 rounded-[32px] border border-white/5 shadow-premium">
            <h3 className="text-3xl font-serif font-black mb-10 text-white">Agendamentos <span className="italic-serif text-gold">Recentes</span></h3>
            <div className="space-y-6">
               {bookings.slice(0, 5).map(b => (
                 <button 
                  key={b.id} 
                  onClick={() => setModal({ isOpen: true, type: 'booking', data: b })}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-gold/20"
                 >
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black rounded-xl shadow-lg border border-white/5">{b.userName?.[0]}</div>
                       <div className="text-left">
                          <p className="text-xs font-black font-sans uppercase tracking-widest text-white">{b.userName}</p>
                          <p className="text-[11px] text-gray-500 font-light italic-serif">{b.serviceName}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black font-sans text-white">{format(new Date(b.datetime), "dd MMM, HH:mm")}</p>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${b.status === 'Cancelado' ? 'text-red-500' : 'text-gold'}`}>{b.status}</p>
                    </div>
                 </button>
               ))}
               {bookings.length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Nenhum agendamento realizado.</p>}
            </div>
         </div>
         <div className="bg-noir p-10 rounded-[32px] border border-white/5 shadow-premium">
            <h3 className="text-3xl font-serif font-black mb-10 text-white">Gift Cards <span className="italic-serif text-gold">Ativos</span></h3>
            <div className="space-y-6">
               {giftCards.filter(c => c.status === 'active').slice(0, 5).map(c => (
                 <div key={c.id} className="flex items-center justify-between p-6 border border-white/5 rounded-2xl bg-black">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center rounded-xl"><Gift size={20} /></div>
                       <div>
                          <p className="text-xs font-black font-sans tracking-[0.2em] text-white">{c.code}</p>
                          <p className="text-[10px] text-gray-500 font-sans">Criado em {format(new Date(c.createdAt), "dd/MM/yy")}</p>
                       </div>
                    </div>
                    <p className="text-2xl font-serif font-black text-gold">R$ {c.amount}</p>
                 </div>
               ))}
               {giftCards.filter(c => c.status === 'active').length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Nenhum gift card ativo no momento.</p>}
            </div>
         </div>
      </div>
    </div>
  );

  const BookingsSection = () => (
    <div className="bg-noir rounded-[32px] border border-white/10 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 border-b border-white/5 flex justify-between items-center bg-noir">
         <h3 className="text-3xl font-serif font-black text-white">Gestão de <span className="italic-serif text-gold">Agendamentos</span></h3>
         <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 text-white hover:bg-gold hover:text-black"><Download size={14} className="mr-2" /> Exportar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Cliente</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">Serviço</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Data & Hora</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Status</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...bookings].sort((a,b) => new Date(b.datetime) - new Date(a.datetime)).map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setModal({ isOpen: true, type: 'booking', data: b })}>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0F1113] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">{b.userName?.[0]}</div>
                      <span className="text-xs font-black font-sans uppercase tracking-[0.1em]">{b.userName}</span>
                   </div>
                </td>
                <td className="px-10 py-8 text-xs text-gray-500 font-light italic-serif hidden md:table-cell">{b.serviceName}</td>
                <td className="px-10 py-8">
                   <p className="text-[11px] font-black font-sans">{format(new Date(b.datetime), "dd/MM/yyyy")}</p>
                   <p className="text-[11px] text-[#AF944F] font-bold font-sans">{format(new Date(b.datetime), "HH:mm")}</p>
                </td>
                <td className="px-10 py-8 hidden sm:table-cell">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${b.status === 'Cancelado' ? 'bg-red-50 text-red-600' : 'bg-[#AF944F]/5 text-[#AF944F]'}`}>
                      {b.status}
                   </span>
                </td>
                <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                   <div className="flex justify-end gap-2">
                      <button onClick={() => setModal({ isOpen: true, type: 'booking', data: b })} className="p-2 text-gray-300 hover:text-black transition-colors">
                         <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteBooking(b.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ClientsSection = () => (
    <div className="bg-noir rounded-[32px] border border-white/10 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 border-b border-white/5 bg-noir">
         <h3 className="text-3xl font-serif font-black text-white">Base de <span className="italic-serif text-gold">Clientes</span></h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Cliente</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">E-mail</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Telefone</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden lg:table-cell">Cadastro</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setModal({ isOpen: true, type: 'client', data: u })}>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-black text-xs shadow-sm border border-gold/20">{u.name?.[0]}</div>
                      <span className="text-xs font-black font-sans uppercase tracking-[0.1em] text-white">{u.name}</span>
                   </div>
                </td>
                <td className="px-10 py-8 text-xs text-gray-400 font-sans hidden md:table-cell">{u.email}</td>
                <td className="px-10 py-8 text-xs text-gray-400 font-sans hidden sm:table-cell">{u.phone || 'N/A'}</td>
                <td className="px-10 py-8 text-xs text-gray-500 font-light italic-serif hidden lg:table-cell">{format(new Date(u.createdAt || Date.now()), "dd/MM/yyyy")}</td>
                <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                   <button onClick={() => setModal({ isOpen: true, type: 'client', data: u })} className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Search size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GiftCardsSection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-noir p-10 rounded-[32px] border border-white/5 shadow-premium">
         <div>
            <h3 className="text-3xl font-serif font-black text-white">Gift <span className="italic-serif text-gold">Cards</span></h3>
            <p className="text-xs text-gray-500 font-light italic-serif mt-2">Gestão de códigos e créditos promocionais.</p>
         </div>
         <Button onClick={() => setModal({ isOpen: true, type: 'add-giftcard' })} variant="secondary" size="md" className="shadow-lg">
           <Plus size={16} className="mr-2" /> Gerar Novo
         </Button>
      </div>

      <div className="bg-noir rounded-[32px] border border-white/10 shadow-premium overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Código</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Valor</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Status</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Criação</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {giftCards.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-10 py-8 text-xs font-black tracking-[0.2em] font-sans">{c.code}</td>
                <td className="px-10 py-8 font-serif font-black text-[#AF944F] text-lg">R$ {c.amount.toFixed(2)}</td>
                <td className="px-10 py-8">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {c.status}
                   </span>
                </td>
                <td className="px-10 py-8 text-xs text-gray-400 font-sans hidden sm:table-cell">{format(new Date(c.createdAt), "dd/MM/yyyy")}</td>
                <td className="px-10 py-8 text-right">
                   <button onClick={() => deleteGiftCard(c.id)} className="p-3 text-gray-300 hover:text-red-500 rounded-xl hover:bg-white transition-all">
                    <Trash2 size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ServicesSection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-noir p-10 rounded-[32px] border border-white/5 shadow-premium">
         <h3 className="text-3xl font-serif font-black text-white">Catálogo de <span className="italic-serif text-gold">Serviços</span></h3>
         <Button onClick={() => setModal({ isOpen: true, type: 'service' })} variant="secondary" size="md" className="shadow-lg">
           <Plus size={16} className="mr-2" /> Novo Serviço
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {services.map(s => (
           <Card key={s.id} padding={false} className="overflow-hidden border border-white/10 hover:border-gold/40 transition-all shadow-premium group rounded-[32px] bg-noir">
              <div className="h-48 bg-black relative">
                 <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75 group-hover:brightness-100" alt={s.name} />
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setModal({ isOpen: true, type: 'service', data: s })} className="p-3 bg-black/40 backdrop-blur-xl text-white rounded-xl hover:bg-gold hover:text-black transition-all shadow-lg border border-white/10"><Edit2 size={14} /></button>
                    <button onClick={() => deleteService(s.id)} className="p-3 bg-black/40 backdrop-blur-xl text-white rounded-xl hover:bg-red-600 transition-all shadow-lg border border-white/10"><Trash2 size={14} /></button>
                 </div>
              </div>
              <div className="p-10 space-y-5">
                 <div className="flex justify-between items-start">
                    <h4 className="text-xl font-serif font-black text-white">{s.name}</h4>
                    <span className="text-2xl font-serif font-black text-gold">R$ {s.price}</span>
                 </div>
                 <p className="text-[11px] text-gray-500 font-light italic-serif leading-relaxed line-clamp-2">{s.description}</p>
                 <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-600 font-sans">
                    <Clock size={12} className="text-gold" /> {s.duration} MINUTOS
                 </div>
              </div>
           </Card>
         ))}
      </div>
    </div>
  );

  const ModernModal = () => {
    const [formData, setFormData] = useState(modal.data || {});
    if (!modal.isOpen) return null;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSave = () => {
      if (modal.type === 'service') {
        const data = { 
          ...formData, 
          price: Number(formData.price), 
          duration: Number(formData.duration),
          image: formData.image || 'https://images.unsplash.com/photo-1629191062635-430932fb6d0d?q=80&w=1000&auto=format&fit=crop'
        };
        if (modal.data) updateService(modal.data.id, data);
        else addService(data);
      } else if (modal.type === 'booking') {
        updateBooking(modal.data.id, formData);
      } else if (modal.type === 'add-giftcard') {
        addGiftCard({ amount: Number(formData.amount || 50) });
      }
      setModal({ isOpen: false, type: null, data: null });
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({ isOpen: false })} className="absolute inset-0 bg-[#0F1113]/90 backdrop-blur-xl" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="bg-[#1A1A1A] w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden z-20 flex flex-col max-h-[90vh] border border-white/10"
        >
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-noir">
            <h4 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">
              {modal.type === 'service' ? (modal.data ? 'Editar Serviço' : 'Novo Serviço') : 
               modal.type === 'booking' ? 'Detalhes do Agendamento' : 
               modal.type === 'client' ? 'Perfil do Cliente' : 'Novo Gift Card'}
            </h4>
            <button onClick={() => setModal({ isOpen: false })} className="p-3 hover:bg-white/10 text-white rounded-xl transition-all shadow-sm group">
               <X size={20} />
            </button>
          </div>

          <div className="p-10 overflow-y-auto space-y-8 custom-scrollbar">
            {modal.type === 'service' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nome do Serviço</label>
                  <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Preço (R$)</label>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Duração (minutos)</label>
                  <input type="number" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Imagem de Capa</label>
                  <div className="flex gap-4 items-center">
                    <label className="flex-1 cursor-pointer bg-black border border-white/5 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-gold hover:text-black transition-all text-white">
                       UPLOAD NOIR
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {formData.image && <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10"><img src={formData.image} className="w-full h-full object-cover" /></div>}
                  </div>
                </div>
                <div className="col-span-full space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Descrição Comercial</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl h-32 font-serif text-sm italic-serif" />
                </div>
              </div>
            )}

            {modal.type === 'booking' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6 p-6 bg-[#FCFBFA] rounded-2xl border border-black/5">
                  <div className="w-16 h-16 bg-[#0F1113] text-white flex items-center justify-center text-2xl font-serif font-black rounded-2xl shadow-xl">{formData.userName?.[0]}</div>
                  <div>
                    <h5 className="text-xl font-serif font-black text-[#0F1113]">{formData.userName}</h5>
                    <p className="text-xs text-gray-400 font-sans tracking-widest uppercase">{formData.serviceName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-premium">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Data Marcada</p>
                      <p className="text-lg font-serif font-black">{format(new Date(formData.datetime), "dd 'de' MMMM", { locale: ptBR })}</p>
                   </div>
                   <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-premium">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Horário</p>
                      <p className="text-lg font-serif font-black text-[#AF944F]">{format(new Date(formData.datetime), "HH:mm")}</p>
                   </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status do Atendimento</label>
                  <div className="flex gap-3">
                    {['Confirmado', 'Pendente', 'Concluído', 'Cancelado'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setFormData({...formData, status: s})}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${formData.status === s ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-black/5 hover:border-black/20'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {modal.type === 'client' && (
               <div className="space-y-8 text-center py-6">
                  <div className="w-24 h-24 mx-auto bg-[#AF944F]/10 text-[#AF944F] flex items-center justify-center text-4xl font-serif font-black rounded-[32px] shadow-premium mb-6">
                    {formData.name?.[0]}
                  </div>
                  <div>
                    <h5 className="text-3xl font-serif font-black text-[#0F1113] mb-2">{formData.name}</h5>
                    <p className="text-sm text-gray-400 font-light italic-serif">Membro desde {format(new Date(formData.createdAt || Date.now()), "MMMM 'de' yyyy", { locale: ptBR })}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                     <div className="p-6 bg-[#FCFBFA] rounded-2xl border border-black/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">E-mail de Contato</p>
                        <p className="text-xs font-black font-sans truncate">{formData.email}</p>
                     </div>
                     <div className="p-6 bg-[#FCFBFA] rounded-2xl border border-black/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">WhatsApp</p>
                        <p className="text-xs font-black font-sans">{formData.phone || 'Não informado'}</p>
                     </div>
                  </div>
               </div>
            )}

            {modal.type === 'add-giftcard' && (
               <div className="space-y-8">
                  <div className="p-10 bg-[#AF944F]/5 rounded-[32px] border-2 border-dashed border-[#AF944F]/20 text-center">
                    <Gift size={48} className="mx-auto mb-6 text-[#AF944F]" />
                    <h5 className="text-xl font-serif font-black text-[#0F1113] mb-2">Novo Vale Presente</h5>
                    <p className="text-xs text-gray-400 font-light italic-serif max-w-xs mx-auto">Gere um código exclusivo para crédito em procedimentos na Noir Luxe.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor do Crédito (R$)</label>
                    <input type="number" value={formData.amount || 50} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-6 bg-[#F5F5F7] border-none rounded-2xl font-serif font-black text-3xl text-center" />
                  </div>
               </div>
            )}
          </div>

          <div className="p-10 bg-[#FCFBFA] border-t border-black/5 flex gap-4">
            <Button onClick={handleSave} variant="primary" size="lg" className="flex-1 shadow-xl">
              {modal.type === 'client' ? 'Fechar Perfil' : 'Salvar Alterações'}
            </Button>
            <Button onClick={() => setModal({ isOpen: false })} variant="outline" size="lg">Cancelar</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const GallerySection = () => {
    const [imageUrl, setImageUrl] = useState('');
    const handleAdd = () => {
      if (!imageUrl) return;
      addGalleryImage({ url: imageUrl, category: 'Portrait' });
      setImageUrl('');
    }

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-10 rounded-[32px] border border-black/5 shadow-premium flex flex-col md:flex-row gap-8 items-end">
           <div className="flex-1 space-y-4 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-sans">Nova Imagem (URL ou Base64)</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-5 bg-[#FCFBFA] border border-black/5 rounded-2xl focus:ring-1 focus:ring-[#AF944F] transition-all" placeholder="Cole a URL ou use o upload em serviços..." />
           </div>
           <Button onClick={handleAdd} variant="primary" className="h-[64px] px-12">Adicionar à Galeria</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
           {gallery.map(img => (
             <div key={img.id} className="aspect-square relative group rounded-[24px] overflow-hidden border border-black/5 shadow-premium">
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Galeria" />
                <div className="absolute inset-0 bg-[#0F1113]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <button onClick={() => deleteGalleryImage(img.id)} className="p-4 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash2 size={24} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      <AnimatePresence>
        {modal.isOpen && <ModernModal />}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-noir text-white flex flex-col z-50 sticky top-0 h-screen border-r border-white/5"
      >
        <div className="p-8 mb-12 flex items-center justify-between overflow-hidden">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
                <span className="text-xl font-serif font-black tracking-tighter leading-none">GS. <span className="text-gold">Admin</span></span>
                <span className="text-[8px] uppercase tracking-[0.5em] text-gray-600 mt-1">Noir Luxe Control</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 transition-colors rounded-lg">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-6 p-5 transition-all duration-500 group relative rounded-2xl
                ${activeTab === item.id ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em] font-sans">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <button onClick={logout} className="flex items-center gap-6 text-gray-500 hover:text-red-400 transition-colors w-full p-4 hover:bg-red-500/5 rounded-2xl">
              <LogOut size={20} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sair</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 sm:px-12 bg-noir sticky top-0 z-40 shadow-2xl">
           <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
              <h2 className="text-lg sm:text-xl font-serif font-black uppercase tracking-tighter whitespace-nowrap">Dashboard <span className="italic-serif text-gold hidden sm:inline">Noir</span></h2>
              <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 truncate">{menuItems.find(m => m.id === activeTab)?.label}</p>
           </div>
           <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{user.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-gold opacity-60">Curador Geral</p>
                 </div>
                 <div className="w-10 h-10 bg-gold text-black flex items-center justify-center font-serif font-black rounded-xl">
                    {user.name[0]}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-6 sm:p-12 max-w-[1400px] w-full mx-auto overflow-hidden">
           {activeTab === 'dashboard' && <DashboardSection />}
           {activeTab === 'agendamentos' && <BookingsSection />}
           {activeTab === 'clientes' && <ClientsSection />}
           {activeTab === 'giftcards' && <GiftCardsSection />}
           {activeTab === 'servicos' && <ServicesSection />}
           {activeTab === 'galeria' && <GallerySection />}
        </div>
      </main>
    </div>
  );
}
