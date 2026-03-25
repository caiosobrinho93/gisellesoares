import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, Users, Calendar, Settings, LogOut, 
  Menu, X, Search, Bell, Filter, ChevronDown, 
  MoreHorizontal, Plus, Download, Sparkles, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../components/ui/Button';

export default function Admin() {
  const { user, logout } = useAuth();
  const { bookings, users, services } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'agendamentos', label: 'Bookings', icon: Calendar },
    { id: 'clientes', label: 'Clients', icon: Users },
    { id: 'relatorios', label: 'Insights', icon: BarChart3 },
    { id: 'config', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Clients', value: users.length, change: '+12%', icon: Users },
    { label: 'Active Sequences', value: bookings.length, change: '+5%', icon: Calendar },
    { label: 'Monthly Rev', value: 'R$ 8.420', change: '+18%', icon: BarChart3 },
    { label: 'Average Edit', value: 'R$ 145', change: '-2%', icon: Sparkles },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* SIDEBAR: NOIR */}
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
        {/* Top Header */}
        <header className="h-24 border-b border-black/5 flex items-center justify-between px-12 bg-white sticky top-0 z-40">
           <div className="flex items-center gap-8">
              <h2 className="text-xl font-serif font-black uppercase tracking-tighter">Command <span className="italic-serif text-[#AF944F]">Centre</span></h2>
              <div className="h-6 w-[1px] bg-black/5" />
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 cursor-pointer hover:text-black">
                 <Filter size={14} /> Filters
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm">
                 <Bell size={18} />
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">{user.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-[#AF944F]">Root Admin</p>
                 </div>
                 <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif font-black">
                    {user.name[0]}
                 </div>
              </div>
           </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-12 space-y-12">
           {/* Stat Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((s, i) => (
                <div key={i} className="p-10 border border-black/5 hover:border-black transition-all duration-700 bg-white group">
                   <div className="flex justify-between items-start mb-8 text-gray-300 group-hover:text-[#AF944F] transition-colors">
                      <s.icon size={20} />
                      <span className="text-[10px] font-bold text-black">{s.change}</span>
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-2">{s.label}</p>
                   <p className="text-4xl font-serif font-black tracking-tighter text-black">{s.value}</p>
                </div>
              ))}
           </div>

           {/* Table Section */}
           <div className="space-y-12">
              <div className="flex items-center justify-between">
                 <h3 className="text-3xl font-serif font-black tracking-tighter">Recent Sequences</h3>
                 <Button variant="primary" size="sm">Download Log</Button>
              </div>
              
              <div className="border border-black/5 overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-black text-white">
                       <tr>
                          <th className="p-8 text-[9px] font-bold uppercase tracking-[0.4em]">Sequence ID</th>
                          <th className="p-8 text-[9px] font-bold uppercase tracking-[0.4em]">Client Entity</th>
                          <th className="p-8 text-[9px] font-bold uppercase tracking-[0.4em]">Applied Edit</th>
                          <th className="p-8 text-[9px] font-bold uppercase tracking-[0.4em]">Scheduled</th>
                          <th className="p-8 text-[9px] font-bold uppercase tracking-[0.4em] text-right">Revenue</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                       {bookings.slice(0, 8).map((b, i) => (
                         <tr key={b.id || i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-8 text-[10px] font-bold text-gray-300">
                               #{b.id ? b.id.slice(-6) : 'REF-ERR'}
                            </td>
                            <td className="p-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-black/5 flex items-center justify-center text-[10px] font-black">
                                     {b.userName ? b.userName[0] : '?'}
                                  </div>
                                  <span className="text-xs font-bold text-black uppercase tracking-widest">
                                     {b.userName || 'Anonymous'}
                                  </span>
                               </div>
                            </td>
                            <td className="p-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                               {b.serviceName || 'Service Edit'}
                            </td>
                            <td className="p-8 text-[10px] font-bold text-gray-500">
                               {b.datetime ? format(new Date(b.datetime), "dd MMM, HH:mm") : '--/--'}
                            </td>
                            <td className="p-8 text-[12px] font-serif font-black text-right">
                               R$ {(b.price || 0).toFixed(2)}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
