import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { nailColors } from '../data/nailColors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Section, { Container } from '../components/ui/Section';
import { Sparkles, Check, Heart, ChevronLeft, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import { motion } from 'framer-motion';

export default function Esmaltes() {
  useReveal();
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState(user?.preferredColor || null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Group colors by category
  const categories = nailColors.reduce((acc, color) => {
    if (!acc[color.category]) acc[color.category] = [];
    acc[color.category].push(color);
    return acc;
  }, {});

  const handleSave = async () => {
    if (!selected) return;
    const res = await updateUser({ preferredColor: selected });
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen">
      {/* Header Editorial */}
      <section className="bg-[#0F1113] pt-32 pb-20">
        <Container>
          <div className="max-w-4xl editorial-reveal">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all mb-10">
              <ChevronLeft size={16} /> Voltar para Início
            </Link>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-[1.5px] bg-[#AF944F] rounded-full" />
               <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F]">Curadoria</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-black text-white leading-tight mb-8">
               Catálogo <span className="italic-serif text-[#AF944F]">Cromático</span>.
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed italic-serif">
               Uma seleção de tons profundos e clássicos para sua próxima escolha.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories Grid */}
      <Section background="bg-transparent">
        <div className="space-y-32">
          {Object.entries(categories).map(([category, colors], catIdx) => (
            <div key={category} className="editorial-reveal" style={{ transitionDelay: `${catIdx * 150}ms` }}>
              <div className="flex items-baseline gap-8 mb-16 border-b border-black/5 pb-8">
                 <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight uppercase">{category}</h2>
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300">
                    {colors.length} {colors.length === 1 ? 'VARIANTE' : 'VARIANTES'}
                 </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {colors.map((color) => (
                  <Card 
                    key={color.id} 
                    onClick={() => setSelected(color.id)}
                    className={`relative cursor-pointer transition-all duration-700
                      ${selected === color.id ? 'ring-2 ring-[#AF944F] border-transparent' : 'border-black/5'}`}
                  >
                    <div className="aspect-square w-full mb-8 overflow-hidden rounded-[20px] shadow-inner relative group">
                       <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110" style={{ backgroundColor: color.hex }} />
                       {selected === color.id && (
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white">
                            <Check size={32} strokeWidth={3} />
                         </div>
                       )}
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F1113]">{color.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#AF944F] mt-1">{color.finish}</p>
                       </div>
                       <Heart size={16} className={`transition-colors ${selected === color.id ? 'text-red-500 fill-red-500' : 'text-gray-200'}`} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Float Save Action */}
      {selected && (
        <motion.div 
          initial={{ y: 100 }} 
          animate={{ y: 0 }}
          className="fixed bottom-12 left-0 w-full z-50 pointer-events-none"
        >
          <Container className="flex justify-center">
             <div className="bg-[#0F1113] text-white p-6 md:px-12 md:py-8 rounded-[32px] shadow-2xl flex items-center gap-10 border border-white/10 pointer-events-auto">
                <div className="hidden md:block">
                   <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-1">Tom Selecionado</p>
                   <p className="text-xl font-serif font-black">{nailColors.find(c => c.id === selected)?.name}</p>
                </div>
                <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                <Button 
                  onClick={handleSave} 
                  variant="secondary" 
                  size="lg"
                  disabled={saveSuccess}
                >
                  {saveSuccess ? (
                    <span className="flex items-center gap-3"><Check size={18} /> Preferência Salva</span>
                  ) : (
                    "Confirmar Escolha"
                  )}
                </Button>
             </div>
          </Container>
        </motion.div>
      )}
    </div>
  );
}
