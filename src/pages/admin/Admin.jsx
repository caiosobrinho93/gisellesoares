import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3, Users, Calendar, Settings, LogOut,
  Menu, X, Search, Filter, Plus, Download, Sparkles, LayoutDashboard,
  Gift, Image as ImageIcon, Trash2, Edit2, CheckCircle, XCircle, Clock,
  Home, DollarSign, MessageSquare, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Admin() {
  const { user, logout } = useAuth();
  const {
    bookings, services, gallery, giftCards, getAllUsers,
    updateBooking, deleteBooking, addService, updateService, deleteService,
    addGiftCard, deleteGiftCard, addGalleryImage, updateGalleryImage, deleteGalleryImage,
    getFinancials
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  const users = getAllUsers();

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

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
    { label: 'Clientes', value: users.length, icon: Users },
    { label: 'Agendamentos', value: bookings.length, icon: Calendar },
    { label: 'Faturamento', value: `R$ ${financialStats.total.toFixed(0)}`, icon: BarChart3 },
    { label: 'Gift Cards', value: giftCards.filter(c => c.status === 'active').length, icon: Sparkles },
  ];

  // Sort bookings: closest to now first (upcoming first, then past)
  const sortedBookings = useMemo(() => {
    const now = new Date();
    return [...bookings].sort((a, b) => {
      const diffA = Math.abs(differenceInMinutes(new Date(a.datetime), now));
      const diffB = Math.abs(differenceInMinutes(new Date(b.datetime), now));
      return diffA - diffB;
    });
  }, [bookings]);

  // DashboardSection
  const DashboardSection = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {stats.map((s, i) => (
          <div key={i} className="p-6 md:p-10 border border-white/5 hover:border-gold/30 transition-all duration-700 bg-noir group rounded-[28px] md:rounded-[32px] shadow-premium">
            <div className="flex justify-between items-start mb-6 text-gray-500 group-hover:text-gold transition-colors">
              <s.icon size={20} />
            </div>
            <p className="text-[10px] font-black font-sans uppercase tracking-[0.4em] text-gray-500 mb-2">{s.label}</p>
            <p className="text-3xl md:text-4xl font-serif font-black tracking-tighter text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-noir p-8 md:p-10 rounded-[28px] md:rounded-[32px] border border-white/5 shadow-premium">
          <h3 className="text-2xl md:text-3xl font-serif font-black mb-8 text-white">
            Agendamentos <span className="italic-serif text-gold">Próximos</span>
          </h3>
          <div className="space-y-4">
            {sortedBookings.slice(0, 6).map(b => (
              <button
                key={b.id}
                onClick={() => setModal({ isOpen: true, type: 'booking', data: b })}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-gold/20 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black rounded-xl text-sm shrink-0 border border-white/5">
                    {b.userName?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black font-sans uppercase tracking-widest text-white">{b.userName}</p>
                    <p className="text-[11px] text-gray-500 font-light italic-serif">{b.serviceName}</p>
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-[10px] font-black font-sans text-white">{format(new Date(b.datetime), "dd MMM, HH:mm", { locale: ptBR })}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${b.status === 'Cancelado' ? 'text-red-400' : b.status === 'Concluído' ? 'text-green-400' : 'text-gold'}`}>{b.status}</span>
                    {b.paid && <span className="text-[8px] font-black uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Pago</span>}
                  </div>
                </div>
              </button>
            ))}
            {bookings.length === 0 && <p className="text-center text-gray-500 italic-serif py-12">Nenhum agendamento ainda.</p>}
          </div>
        </div>
        <div className="bg-noir p-8 md:p-10 rounded-[28px] md:rounded-[32px] border border-white/5 shadow-premium">
          <h3 className="text-2xl md:text-3xl font-serif font-black mb-8 text-white">Gift Cards <span className="italic-serif text-gold">Ativos</span></h3>
          <div className="space-y-4">
            {giftCards.filter(c => c.status === 'active').slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center justify-between p-5 border border-white/5 rounded-2xl bg-black">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-xl"><Gift size={18} /></div>
                  <div>
                    <p className="text-xs font-black font-sans tracking-[0.2em] text-white">{c.code}</p>
                    <p className="text-[10px] text-gray-500 font-sans">{format(new Date(c.createdAt), "dd/MM/yy")}</p>
                  </div>
                </div>
                <p className="text-xl font-serif font-black text-gold">R$ {c.amount}</p>
              </div>
            ))}
            {giftCards.filter(c => c.status === 'active').length === 0 && <p className="text-center text-gray-500 italic-serif py-12">Nenhum gift card ativo.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const BookingsSection = () => (
    <div className="bg-noir rounded-[32px] border border-white/5 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-2xl md:text-3xl font-serif font-black text-white">Gestão de <span className="italic-serif text-gold">Agendamentos</span></h3>
        <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 text-white hover:bg-gold hover:text-black text-xs">
          <Download size={14} className="mr-2" /> Exportar
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Cliente</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">Serviço</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Data & Hora</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Status</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedBookings.map(b => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setModal({ isOpen: true, type: 'booking', data: b })}>
                <td className="px-6 md:px-10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center font-black text-xs border border-white/5 shrink-0">{b.userName?.[0]}</div>
                    <span className="text-xs font-black font-sans uppercase tracking-[0.1em] text-white">{b.userName}</span>
                  </div>
                </td>
                <td className="px-6 md:px-10 py-6 text-xs text-gray-500 font-light italic-serif hidden md:table-cell">{b.serviceName}</td>
                <td className="px-6 md:px-10 py-6">
                  <p className="text-[11px] font-black font-sans text-white">{format(new Date(b.datetime), "dd/MM/yyyy")}</p>
                  <p className="text-[11px] text-gold font-bold font-sans">{format(new Date(b.datetime), "HH:mm")}</p>
                </td>
                <td className="px-6 md:px-10 py-6 hidden sm:table-cell">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${b.status === 'Cancelado' ? 'bg-red-500/10 text-red-400' : b.status === 'Concluído' ? 'bg-green-500/10 text-green-400' : 'bg-gold/10 text-gold'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 md:px-10 py-6 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModal({ isOpen: true, type: 'booking', data: b })} className="p-2 text-gray-500 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { if (window.confirm('Excluir agendamento?')) deleteBooking(b.id); }} className="p-2 text-gray-500 hover:text-red-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Nenhum agendamento.</p>}
      </div>
    </div>
  );

  const ClientsSection = () => (
    <div className="bg-noir rounded-[32px] border border-white/5 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 md:p-10 border-b border-white/5">
        <h3 className="text-2xl md:text-3xl font-serif font-black text-white">Base de <span className="italic-serif text-gold">Clientes</span></h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Cliente</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">E-mail</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Telefone</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden lg:table-cell">Cadastro</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setModal({ isOpen: true, type: 'client', data: u })}>
                <td className="px-6 md:px-10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-black text-xs border border-gold/20 shrink-0">{u.name?.[0]}</div>
                    <span className="text-xs font-black font-sans uppercase tracking-[0.1em] text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 md:px-10 py-6 text-xs text-gray-400 font-sans hidden md:table-cell truncate max-w-[200px]">{u.email}</td>
                <td className="px-6 md:px-10 py-6 text-xs text-gray-400 font-sans hidden sm:table-cell">{u.phone || 'N/A'}</td>
                <td className="px-6 md:px-10 py-6 text-xs text-gray-500 font-light italic-serif hidden lg:table-cell">{format(new Date(u.createdAt || Date.now()), "dd/MM/yyyy")}</td>
                <td className="px-6 md:px-10 py-6 text-right" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setModal({ isOpen: true, type: 'client', data: u })} className="p-2 text-gray-500 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ml-auto">
                    <Search size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Nenhum cliente cadastrado.</p>}
      </div>
    </div>
  );

  const GiftCardsSection = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-noir p-8 md:p-10 rounded-[32px] border border-white/5 shadow-premium">
        <div>
          <h3 className="text-2xl md:text-3xl font-serif font-black text-white">Gift <span className="italic-serif text-gold">Cards</span></h3>
          <p className="text-xs text-gray-500 font-light italic-serif mt-2">Gestão de códigos promocionais.</p>
        </div>
        <Button onClick={() => setModal({ isOpen: true, type: 'add-giftcard' })} variant="secondary" size="md" className="shadow-lg">
          <Plus size={16} className="mr-2" /> Gerar Novo
        </Button>
      </div>
      <div className="bg-noir rounded-[32px] border border-white/5 shadow-premium overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Código</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Valor</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Status</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Criação</th>
              <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {giftCards.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 md:px-10 py-6 text-xs font-black tracking-[0.2em] font-sans text-white">{c.code}</td>
                <td className="px-6 md:px-10 py-6 font-serif font-black text-gold text-lg">R$ {c.amount.toFixed(2)}</td>
                <td className="px-6 md:px-10 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                    {c.status === 'active' ? 'Ativo' : 'Utilizado'}
                  </span>
                </td>
                <td className="px-6 md:px-10 py-6 text-xs text-gray-400 font-sans hidden sm:table-cell">{format(new Date(c.createdAt), "dd/MM/yyyy")}</td>
                <td className="px-6 md:px-10 py-6 text-right">
                  <button onClick={() => deleteGiftCard(c.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-xl transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ml-auto">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {giftCards.length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Nenhum gift card criado.</p>}
      </div>
    </div>
  );

  const ServicesSection = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-noir p-8 md:p-10 rounded-[32px] border border-white/5 shadow-premium">
        <h3 className="text-2xl md:text-3xl font-serif font-black text-white">Catálogo de <span className="italic-serif text-gold">Serviços</span></h3>
        <Button onClick={() => setModal({ isOpen: true, type: 'service' })} variant="secondary" size="md">
          <Plus size={16} className="mr-2" /> Novo
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(s => (
          <Card key={s.id} padding={false} className="overflow-hidden border border-white/10 hover:border-gold/40 transition-all shadow-premium group rounded-[32px] bg-noir">
            <div className="h-48 bg-black relative">
              <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75 group-hover:brightness-100" alt={s.name} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setModal({ isOpen: true, type: 'service', data: s })} className="p-3 bg-black/40 backdrop-blur-xl text-white rounded-xl hover:bg-gold hover:text-black transition-all border border-white/10"><Edit2 size={14} /></button>
                <button onClick={() => { if (window.confirm('Excluir serviço?')) deleteService(s.id); }} className="p-3 bg-black/40 backdrop-blur-xl text-white rounded-xl hover:bg-red-600 transition-all border border-white/10"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-serif font-black text-white">{s.name}</h4>
                <span className="text-2xl font-serif font-black text-gold">R$ {s.price}</span>
              </div>
              <p className="text-[11px] text-gray-500 font-light italic-serif leading-relaxed line-clamp-2">{s.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-600 font-sans">
                <Clock size={12} className="text-gold" /> {s.duration} MIN
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const GallerySection = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [editingImg, setEditingImg] = useState(null);
    const [editAlt, setEditAlt] = useState('');

    const handleAdd = () => {
      if (!imageUrl) return;
      addGalleryImage({ url: imageUrl, alt: imageAlt || 'Trabalho Giselle Soares' });
      setImageUrl('');
      setImageAlt('');
    };

    const handleSaveEdit = (id) => {
      updateGalleryImage(id, { alt: editAlt });
      setEditingImg(null);
    };

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-noir p-8 md:p-10 rounded-[32px] border border-white/5 shadow-premium space-y-6">
          <h3 className="text-2xl font-serif font-black text-white">Adicionar <span className="italic-serif text-gold">Imagem</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL da Imagem</label>
              <input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white text-sm font-sans focus:ring-1 focus:ring-gold outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legenda / Descrição</label>
              <input
                value={imageAlt}
                onChange={e => setImageAlt(e.target.value)}
                className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white text-sm font-sans focus:ring-1 focus:ring-gold outline-none"
                placeholder="Ex: Esmaltação Nude Gel"
              />
            </div>
          </div>
          <Button onClick={handleAdd} variant="secondary" className="min-h-[48px] px-8">Adicionar à Galeria</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map(img => (
            <div key={img.id} className="rounded-[20px] overflow-hidden border border-white/5 shadow-premium group bg-noir">
              <div className="aspect-square relative">
                <img
                  src={img.url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={img.alt}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400'; }}
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setEditingImg(img.id); setEditAlt(img.alt || ''); }}
                    className="p-3 bg-white/10 text-white rounded-xl hover:bg-gold hover:text-black transition-all"
                  ><Edit2 size={18} /></button>
                  <button
                    onClick={() => { if (window.confirm('Excluir imagem?')) deleteGalleryImage(img.id); }}
                    className="p-3 bg-red-600 text-white rounded-xl hover:scale-110 transition-all"
                  ><Trash2 size={18} /></button>
                </div>
              </div>
              {/* Editable caption */}
              <div className="p-4">
                {editingImg === img.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editAlt}
                      onChange={e => setEditAlt(e.target.value)}
                      className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-gold"
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(img.id)} className="p-2 bg-gold text-black rounded-xl hover:scale-105 transition-all min-w-[36px] flex items-center justify-center"><Check size={14} /></button>
                    <button onClick={() => setEditingImg(null)} className="p-2 bg-white/5 text-white rounded-xl hover:scale-105 transition-all min-w-[36px] flex items-center justify-center"><X size={14} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingImg(img.id); setEditAlt(img.alt || ''); }}
                    className="text-[10px] text-gray-400 hover:text-white transition-colors truncate w-full text-left"
                  >
                    {img.alt || 'Sem legenda — clique para editar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {gallery.length === 0 && <p className="text-center text-gray-500 italic-serif py-16">Galeria vazia.</p>}
      </div>
    );
  };

  // Modal
  const ModernModal = () => {
    const [formData, setFormData] = useState(modal.data || {});
    if (!modal.isOpen) return null;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, image: reader.result });
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
        updateBooking(modal.data.id, {
          status: formData.status,
          paid: formData.paid,
          sessionNote: formData.sessionNote,
        });
      } else if (modal.type === 'add-giftcard') {
        addGiftCard({ amount: Number(formData.amount || 50) });
      }
      setModal({ isOpen: false, type: null, data: null });
    };

    const handleComplete = () => {
      updateBooking(modal.data.id, { status: 'Concluído', paid: true });
      setModal({ isOpen: false, type: null, data: null });
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({ isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] w-full sm:max-w-2xl rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative overflow-hidden z-20 flex flex-col max-h-[92vh] border border-white/10"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-noir">
            <h4 className="text-xl font-serif font-black text-white uppercase tracking-tighter">
              {modal.type === 'service' ? (modal.data ? 'Editar Serviço' : 'Novo Serviço') :
               modal.type === 'booking' ? 'Detalhes do Atendimento' :
               modal.type === 'client' ? 'Perfil do Cliente' : 'Novo Gift Card'}
            </h4>
            <button onClick={() => setModal({ isOpen: false })} className="p-3 hover:bg-white/10 text-white rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-6 flex-1">
            {/* BOOKING MODAL */}
            {modal.type === 'booking' && (
              <div className="space-y-6">
                {/* Client + Service info */}
                <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 bg-gold/20 text-gold flex items-center justify-center text-2xl font-serif font-black rounded-2xl shrink-0">{formData.userName?.[0]}</div>
                  <div>
                    <h5 className="text-xl font-serif font-black text-white">{formData.userName}</h5>
                    <p className="text-xs text-gray-400 font-sans tracking-widest uppercase">{formData.serviceName}</p>
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Data</p>
                    <p className="text-lg font-serif font-black text-white">{format(new Date(formData.datetime), "dd 'de' MMMM", { locale: ptBR })}</p>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Horário</p>
                    <p className="text-lg font-serif font-black text-gold">{format(new Date(formData.datetime), "HH:mm")}</p>
                  </div>
                </div>

                {/* Preço */}
                <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">Valor do Serviço</span>
                  <span className="text-2xl font-serif font-black text-gold">R$ {(formData.price || 0).toFixed(2)}</span>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status do Atendimento</label>
                  <div className="flex flex-wrap gap-2">
                    {['Confirmado', 'Em Andamento', 'Concluído', 'Cancelado'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border min-h-[44px] ${formData.status === s ? 'bg-gold text-coal border-gold' : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Pagamento */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pagamento</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, paid: false })}
                      className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border min-h-[44px] flex items-center justify-center gap-2 ${!formData.paid ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-black/40 text-gray-500 border-white/10'}`}
                    >
                      <XCircle size={16} /> Pendente
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, paid: true })}
                      className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border min-h-[44px] flex items-center justify-center gap-2 ${formData.paid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-black/40 text-gray-500 border-white/10'}`}
                    >
                      <CheckCircle size={16} /> Pago
                    </button>
                  </div>
                </div>

                {/* Observação pós-atendimento */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <MessageSquare size={14} /> Observação da Sessão
                  </label>
                  <textarea
                    value={formData.sessionNote || ''}
                    onChange={e => setFormData({ ...formData, sessionNote: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-sans text-white placeholder:text-gray-600 focus:ring-1 focus:ring-gold outline-none h-24 resize-none"
                    placeholder="Ex: Dona Lúcia usou vermelho fogo com glitter…"
                  />
                </div>
              </div>
            )}

            {/* SERVICE MODAL */}
            {modal.type === 'service' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome do Serviço</label>
                  <input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans focus:ring-1 focus:ring-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preço (R$)</label>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans focus:ring-1 focus:ring-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duração (min)</label>
                  <input type="number" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl font-sans focus:ring-1 focus:ring-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagem</label>
                  <div className="flex gap-3 items-center">
                    <label className="flex-1 cursor-pointer bg-black border border-white/5 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-gold hover:text-black transition-all text-white">
                      Upload <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {formData.image && <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10"><img src={formData.image} className="w-full h-full object-cover" /></div>}
                  </div>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-black border border-white/5 text-white rounded-xl h-28 font-serif text-sm italic-serif focus:ring-1 focus:ring-gold outline-none resize-none" />
                </div>
              </div>
            )}

            {/* CLIENT MODAL */}
            {modal.type === 'client' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-20 h-20 mx-auto bg-gold/10 text-gold flex items-center justify-center text-4xl font-serif font-black rounded-[28px] shadow-premium mb-4">
                  {formData.name?.[0]}
                </div>
                <h5 className="text-3xl font-serif font-black text-white">{formData.name}</h5>
                <p className="text-sm text-gray-400 font-light italic-serif">Membro desde {format(new Date(formData.createdAt || Date.now()), "MMMM 'de' yyyy", { locale: ptBR })}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">E-mail</p>
                    <p className="text-xs font-black font-sans truncate text-white">{formData.email}</p>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">WhatsApp</p>
                    <a href={`tel:${formData.phone}`} className="text-xs font-black font-sans text-gold">{formData.phone || 'Não informado'}</a>
                  </div>
                  {formData.favoriteColors?.length > 0 && (
                    <div className="col-span-full p-5 bg-black/40 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Cores Favoritas</p>
                      <p className="text-xs text-white font-sans">{formData.favoriteColors.length} cor(es) salva(s) no catálogo</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GIFT CARD MODAL */}
            {modal.type === 'add-giftcard' && (
              <div className="space-y-6">
                <div className="p-10 bg-gold/5 rounded-[24px] border-2 border-dashed border-gold/20 text-center">
                  <Gift size={48} className="mx-auto mb-4 text-gold" />
                  <h5 className="text-xl font-serif font-black text-white mb-2">Novo Vale Presente</h5>
                  <p className="text-xs text-gray-400 font-light italic-serif max-w-xs mx-auto">Gere um código exclusivo para crédito em atendimentos.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor do Crédito (R$)</label>
                  <input type="number" value={formData.amount || 50} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl font-serif font-black text-3xl text-center text-white focus:ring-1 focus:ring-gold outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-white/5 bg-black/20">
            {modal.type === 'booking' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {formData.paid && formData.status !== 'Concluído' && (
                  <Button onClick={handleComplete} variant="secondary" size="lg" className="flex-1 text-[10px] tracking-[0.4em] min-h-[52px]">
                    <CheckCircle size={18} className="mr-2" /> Marcar como Concluído
                  </Button>
                )}
                <Button onClick={handleSave} variant="gold" size="lg" className="flex-1 text-[10px] tracking-[0.4em] min-h-[52px]">Salvar</Button>
                <Button onClick={() => setModal({ isOpen: false })} variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/10 min-h-[52px]">Fechar</Button>
              </div>
            ) : modal.type === 'client' ? (
              <Button onClick={() => setModal({ isOpen: false })} variant="gold" size="lg" className="w-full min-h-[52px]">Fechar</Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleSave} variant="gold" size="lg" className="flex-1 min-h-[52px]">Salvar</Button>
                <Button onClick={() => setModal({ isOpen: false })} variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/10 min-h-[52px]">Cancelar</Button>
              </div>
            )}
          </div>
        </motion.div>
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
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="bg-noir text-white flex flex-col z-40 sticky top-0 h-screen border-r border-white/5 shrink-0"
      >
        <div className="p-6 flex items-center justify-between overflow-hidden border-b border-white/5 h-20">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg font-serif font-black tracking-tighter">
                GS. <span className="text-gold">Admin</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 transition-colors rounded-lg shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              className={`w-full flex items-center gap-4 p-4 transition-all duration-300 group relative rounded-2xl min-h-[48px]
                ${activeTab === item.id ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-gold shrink-0' : 'group-hover:text-gold transition-colors shrink-0'} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em] font-sans">{item.label}</span>}
              {activeTab === item.id && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-gold rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          {/* Back to site button */}
          <Link
            to="/"
            title={!sidebarOpen ? 'Voltar ao site' : undefined}
            className="flex items-center gap-4 p-4 text-gray-500 hover:text-gold hover:bg-gold/5 transition-all w-full rounded-2xl min-h-[48px]"
          >
            <Home size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em]">Voltar ao Site</span>}
          </Link>
          <button onClick={logout} className="flex items-center gap-4 p-4 text-gray-500 hover:text-red-400 transition-all w-full rounded-2xl hover:bg-red-500/5 min-h-[48px]">
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-noir sticky top-0 z-30 shadow-2xl">
          <div className="flex items-center gap-4 overflow-hidden">
            <h2 className="text-lg font-serif font-black uppercase tracking-tighter whitespace-nowrap text-white">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gold text-black flex items-center justify-center font-serif font-black rounded-xl text-sm shrink-0">
              {user.name[0]}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] w-full mx-auto">
            {activeTab === 'dashboard' && <DashboardSection />}
            {activeTab === 'agendamentos' && <BookingsSection />}
            {activeTab === 'clientes' && <ClientsSection />}
            {activeTab === 'giftcards' && <GiftCardsSection />}
            {activeTab === 'servicos' && <ServicesSection />}
            {activeTab === 'galeria' && <GallerySection />}
          </div>
        </div>
      </main>
    </div>
  );
}
