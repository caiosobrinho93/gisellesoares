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
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
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
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <div key={i} className="p-10 border border-black/5 hover:border-black transition-all duration-700 bg-white group rounded-[24px] shadow-premium">
            <div className="flex justify-between items-start mb-8 text-gray-300 group-hover:text-[#AF944F] transition-colors">
              <s.icon size={20} />
              <span className="text-[10px] font-bold text-black">{s.change}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-2">{s.label}</p>
            <p className="text-4xl font-serif font-black tracking-tighter text-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="bg-white p-10 rounded-[24px] border border-black/5 shadow-premium">
            <h3 className="text-2xl font-serif font-black mb-8 uppercase tracking-tight">Agendamentos Recentes</h3>
            <div className="space-y-6">
               {bookings.slice(0, 5).map(b => (
                 <div key={b.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-black/5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black rounded-lg">{b.userName?.[0]}</div>
                       <div>
                          <p className="text-xs font-bold uppercase tracking-widest">{b.userName}</p>
                          <p className="text-[10px] text-gray-400 font-light italic-serif">{b.serviceName}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold">{format(new Date(b.datetime), "dd MMM, HH:mm")}</p>
                       <p className="text-[10px] text-[#AF944F] font-black uppercase">{b.status}</p>
                    </div>
                 </div>
               ))}
               {bookings.length === 0 && <p className="text-center text-gray-300 italic-serif py-10">Nenhum agendamento realizado.</p>}
            </div>
         </div>
         <div className="bg-white p-10 rounded-[24px] border border-black/5 shadow-premium">
            <h3 className="text-2xl font-serif font-black mb-8 uppercase tracking-tight">Gift Cards Ativos</h3>
            <div className="space-y-6">
               {giftCards.filter(c => c.status === 'active').slice(0, 5).map(c => (
                 <div key={c.id} className="flex items-center justify-between p-4 border border-black/5 rounded-xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#AF944F]/10 text-[#AF944F] flex items-center justify-center rounded-lg"><Gift size={18} /></div>
                       <div>
                          <p className="text-xs font-black tracking-widest">{c.code}</p>
                          <p className="text-[10px] text-gray-400">Criado em {format(new Date(c.createdAt), "dd/MM/yy")}</p>
                       </div>
                    </div>
                    <p className="text-lg font-serif font-black text-[#AF944F]">R$ {c.amount}</p>
                 </div>
               ))}
               {giftCards.filter(c => c.status === 'active').length === 0 && <p className="text-center text-gray-300 italic-serif py-10">Nenhum gift card ativo.</p>}
            </div>
         </div>
      </div>
    </div>
  );

  const BookingsSection = () => (
    <div className="bg-white rounded-[24px] border border-black/10 shadow-premium overflow-hidden">
      <div className="p-8 border-b border-black/5 flex justify-between items-center">
         <h3 className="text-2xl font-serif font-black uppercase tracking-tight">Gestão de Agendamentos</h3>
         <Button variant="outline" size="sm"><Download size={14} className="mr-2" /> PDF</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cliente</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Serviço</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Data & Hora</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {[...bookings].sort((a,b) => new Date(b.datetime) - new Date(a.datetime)).map(b => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black text-[10px]">{b.userName?.[0]}</div>
                      <span className="text-xs font-bold uppercase tracking-widest">{b.userName}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-xs text-gray-500 italic-serif">{b.serviceName}</td>
                <td className="px-8 py-6">
                   <p className="text-[10px] font-black">{format(new Date(b.datetime), "dd/MM/yyyy")}</p>
                   <p className="text-[10px] text-[#AF944F] font-bold">{format(new Date(b.datetime), "HH:mm")}</p>
                </td>
                <td className="px-8 py-6">
                   <select 
                     value={b.status} 
                     onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                     className="text-[10px] font-black uppercase tracking-widest bg-gray-100 border-none rounded-full px-4 py-1.5 focus:ring-1 focus:ring-[#AF944F] appearance-none"
                   >
                      <option value="Confirmado">Confirmado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Concluído">Concluído</option>
                   </select>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => deleteBooking(b.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
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

  const ClientsSection = () => (
    <div className="bg-white rounded-[24px] border border-black/10 shadow-premium overflow-hidden">
      <div className="p-8 border-b border-black/5">
         <h3 className="text-2xl font-serif font-black uppercase tracking-tight">Base de Clientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cliente</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">E-mail</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Telefone</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cadastro</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#AF944F] text-white flex items-center justify-center font-black text-[10px]">{u.name?.[0]}</div>
                      <span className="text-xs font-black uppercase tracking-widest">{u.name}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-xs text-gray-500">{u.email}</td>
                <td className="px-8 py-6 text-xs text-gray-500">{u.phone || 'N/A'}</td>
                <td className="px-8 py-6 text-xs text-gray-500">{format(new Date(u.createdAt || Date.now()), "dd/MM/yyyy")}</td>
                <td className="px-8 py-6 text-right">
                   <button className="p-2 text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GiftCardsSection = () => {
    const [amount, setAmount] = useState(50);
    const handleAdd = () => {
      addGiftCard({ amount: Number(amount) });
      setIsAddingGiftCard(false);
    }
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center bg-white p-8 rounded-[24px] border border-black/5 shadow-premium">
           <div>
              <h3 className="text-2xl font-serif font-black uppercase tracking-tight mb-2">Gift Cards</h3>
              <p className="text-xs text-gray-400 font-light italic-serif">Gerencie códigos promocionais e presentes.</p>
           </div>
           <Button onClick={() => setIsAddingGiftCard(true)} variant="primary" size="md"><Plus size={16} className="mr-2" /> Gerar Novo</Button>
        </div>

        <AnimatePresence>
          {isAddingGiftCard && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[24px] border-2 border-[#AF944F]/20 shadow-xl max-w-md">
               <h4 className="font-serif font-black text-xl mb-6 uppercase tracking-tight">Novo Gift Card</h4>
               <label className="block text-[10px] font-black uppercase tracking-widest mb-4">Valor (R$)</label>
               <input 
                 type="number" 
                 value={amount} 
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full p-4 mb-8 bg-[#F5F5F7] border-none rounded-xl focus:ring-1 focus:ring-[#AF944F] font-serif font-black text-2xl"
               />
               <div className="flex gap-4">
                  <Button onClick={handleAdd} variant="primary" className="flex-1">Gerar Código</Button>
                  <Button onClick={() => setIsAddingGiftCard(false)} variant="outline">Cancelar</Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[24px] border border-black/10 shadow-premium overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Código</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Valor</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Criado em</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {giftCards.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-8 py-6 text-xs font-black tracking-[0.2em]">{c.code}</td>
                  <td className="px-8 py-6 font-serif font-black">R$ {c.amount.toFixed(2)}</td>
                  <td className="px-8 py-6">
                     <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {c.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-400">{format(new Date(c.createdAt), "dd/MM/yyyy")}</td>
                  <td className="px-8 py-6 text-right">
                     <button onClick={() => deleteGiftCard(c.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {giftCards.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-gray-300 italic-serif">Nenhum gift card cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ServicesSection = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('60');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
      if (editingService) {
        setName(editingService.name);
        setPrice(editingService.price);
        setDuration(editingService.duration);
        setDescription(editingService.description);
        setImage(editingService.image);
      } else {
        setName(''); setPrice(''); setDuration('60'); setDescription(''); setImage('');
      }
    }, [editingService]);

    const handleSave = () => {
      const data = { name, price: Number(price), duration: Number(duration), description, image: image || 'https://images.unsplash.com/photo-1629191062635-430932fb6d0d?q=80&w=1000&auto=format&fit=crop' };
      if (editingService) {
        updateService(editingService.id, data);
      } else {
        addService(data);
      }
      setIsAddingService(false);
      setEditingService(null);
    };

    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center bg-white p-8 rounded-[24px] border border-black/5 shadow-premium">
           <h3 className="text-2xl font-serif font-black uppercase tracking-tight">Catálogo de Serviços</h3>
           <Button onClick={() => setIsAddingService(true)} variant="primary" size="md"><Plus size={16} className="mr-2" /> Novo Serviço</Button>
        </div>

        <AnimatePresence>
          {(isAddingService || editingService) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[32px] border-2 border-black/5 shadow-2xl space-y-8">
               <h4 className="text-2xl font-serif font-black uppercase tracking-tight">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome</label>
                     <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl" placeholder="Nome do atendimento" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preço (R$)</label>
                     <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl" placeholder="Ex: 50.00" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duração (min)</label>
                     <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl" placeholder="Ex: 60" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto URL</label>
                     <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl" placeholder="URL da imagem (Unsplash)" />
                  </div>
                  <div className="col-span-full space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição</label>
                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl h-24" placeholder="Breve descrição do processo..." />
                  </div>
               </div>
               <div className="flex gap-4">
                  <Button onClick={handleSave} variant="primary" className="px-12">Salvar</Button>
                  <Button onClick={() => { setIsAddingService(false); setEditingService(null); }} variant="outline">Cancelar</Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {services.map(s => (
             <Card key={s.id} padding={false} className="overflow-hidden border border-black/5 hover:border-[#AF944F]/40 transition-all shadow-premium group rounded-[24px]">
                <div className="h-40 bg-gray-100 relative">
                   <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={s.name} />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => setEditingService(s)} className="p-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-black transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => deleteService(s.id)} className="p-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                   </div>
                </div>
                <div className="p-8 space-y-4">
                   <div className="flex justify-between items-start">
                      <h4 className="text-lg font-serif font-black uppercase tracking-tight">{s.name}</h4>
                      <span className="text-xl font-serif font-black text-[#AF944F]">R$ {s.price}</span>
                   </div>
                   <p className="text-[10px] text-gray-400 font-light italic-serif leading-relaxed line-clamp-2">{s.description}</p>
                   <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-300">
                      <Clock size={12} /> {s.duration} MINUTOS
                   </div>
                </div>
             </Card>
           ))}
        </div>
      </div>
    );
  };

  const GallerySection = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Nails');

    const handleAdd = () => {
      if (!imageUrl) return;
      addGalleryImage({ url: imageUrl, category });
      setImageUrl('');
    }

    return (
      <div className="space-y-12">
        <div className="bg-white p-8 rounded-[24px] border border-black/5 shadow-premium flex flex-col md:flex-row gap-6 items-end">
           <div className="flex-1 space-y-4 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nova Imagem (URL)</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-4 bg-[#F5F5F7] border-none rounded-xl" placeholder="Cole a URL da imagem..." />
           </div>
           <Button onClick={handleAdd} variant="primary" className="h-[56px] px-12">Adicionar</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {gallery.map(img => (
             <div key={img.id} className="aspect-square relative group rounded-[16px] overflow-hidden border border-black/5 shadow-sm">
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Galeria" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => deleteGalleryImage(img.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all"><Trash2 size={20} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-black text-white flex flex-col z-50 sticky top-0 h-screen"
      >
        <div className="p-8 mb-12 flex items-center justify-between overflow-hidden">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
                <span className="text-xl font-serif font-black tracking-tighter leading-none">GS. <span className="text-[#AF944F]">Admin</span></span>
                <span className="text-[8px] uppercase tracking-[0.5em] text-gray-500 mt-1">Editorial Control</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-6 p-4 transition-all duration-500 group relative
                ${activeTab === item.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-[#AF944F]' : ''} />
              {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-[#AF944F]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <button onClick={logout} className="flex items-center gap-6 text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={20} />
              {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <header className="h-24 border-b border-black/5 flex items-center justify-between px-12 bg-white sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-8">
              <h2 className="text-xl font-serif font-black uppercase tracking-tighter">Command <span className="italic-serif text-[#AF944F]">Centre</span></h2>
              <div className="h-6 w-[1px] bg-black/5" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{menuItems.find(m => m.id === activeTab)?.label}</p>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">{user.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-[#AF944F]">Principal Specialist</p>
                 </div>
                 <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif font-black rounded-lg">
                    {user.name[0]}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-12 max-w-[1400px]">
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
