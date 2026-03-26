import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { nailColors } from '../data/nailColors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Section, { Container } from '../components/ui/Section';
import { Check, Heart, ChevronLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Esmaltes() {
  useReveal();
  const { user, updateUser } = useAuth();
  // favoriteColors is now an array
  const [favorites, setFavorites] = useState(user?.favoriteColors || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories = nailColors.reduce((acc, color) => {
    if (!acc[color.category]) acc[color.category] = [];
    acc[color.category].push(color);
    return acc;
  }, {});

  const toggle = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    const res = await updateUser({ favoriteColors: favorites });
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen">
      {/* Header */}
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
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 uppercase">
               Catálogo <span className="text-[#AF944F]">Cromático</span>.
            </h1>
            <p className="text-xl text-gray-400 font-normal leading-relaxed italic">
               Escolha suas cores favoritas — salvo no seu perfil para a profissional saber sua preferência.
            </p>
            {user && favorites.length > 0 && (
              <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#AF944F]">
                {favorites.length} {favorites.length === 1 ? 'cor selecionada' : 'cores selecionadas'}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <Section background="bg-transparent">
        <div className="space-y-24 md:space-y-32">
          {Object.entries(categories).map(([category, colors], catIdx) => (
            <div key={category} className="editorial-reveal" style={{ transitionDelay: `${catIdx * 150}ms` }}>
              <div className="flex items-baseline gap-8 mb-12 md:mb-16 border-b border-black/5 pb-8">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">{category}</h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300">
                  {colors.length} {colors.length === 1 ? 'VARIANTE' : 'VARIANTES'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12">
                {colors.map((color) => {
                  const isFav = favorites.includes(color.id);
                  return (
                    <Card
                      key={color.id}
                      onClick={() => toggle(color.id)}
                      className={`relative cursor-pointer transition-all duration-500
                        ${isFav ? 'ring-2 ring-[#AF944F] border-transparent scale-[1.02]' : 'border-black/5 hover:scale-[1.01]'}`}
                    >
                      <div className="aspect-square w-full mb-6 overflow-hidden rounded-[20px] shadow-inner relative group">
                        <div
                          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        />
                        <AnimatePresence>
                          {isFav && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/20 flex items-center justify-center text-white"
                            >
                              <Check size={28} strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F1113] leading-tight">{color.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#AF944F] mt-1">{color.finish}</p>
                        </div>
                        <Heart size={16} className={`transition-all shrink-0 ml-2 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-200'}`} />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Float Save Bar */}
      <AnimatePresence>
        {favorites.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-0 w-full z-50 pointer-events-none px-4"
          >
            <div className="max-w-xl mx-auto bg-[#0F1113] text-white p-4 md:p-6 rounded-[32px] shadow-2xl flex items-center justify-between gap-4 border border-white/10 pointer-events-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-1">Selecionadas</p>
                <p className="text-lg font-black">{favorites.length} {favorites.length === 1 ? 'cor' : 'cores'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setFavorites([])}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
                <Button onClick={handleSave} variant="secondary" size="md" disabled={saveSuccess} className="min-h-[44px]">
                  {saveSuccess ? <span className="flex items-center gap-2"><Check size={16} /> Salvo!</span> : 'Salvar Favoritas'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
