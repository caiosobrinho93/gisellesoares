import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { X, ZoomIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section, { Container } from '../components/ui/Section';
import useReveal from '../hooks/useReveal';

export default function Galeria() {
  const { gallery } = useApp();
  const [selectedImg, setSelectedImg] = useState(null);
  useReveal();

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <section className="bg-white pt-32 pb-16">
        <Container>
          <div className="max-w-4xl editorial-reveal">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 hover:text-black transition-all mb-10">
              <ArrowLeft size={16} /> Voltar para Início
            </Link>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-[1.5px] bg-[#AF944F] rounded-full" />
               <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F]">Portfólio</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-black text-[#0F1113] leading-none mb-8">
               Galeria <span className="italic-serif text-[#AF944F]">Exclusiva</span>.
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl italic-serif">
              Uma curadoria visual de nossos trabalhos, precisão técnica e seleção de cores. Cada imagem revela um padrão de excelência.
            </p>
          </div>
        </Container>
      </section>

      {/* Modern Grid: Rounded & Padded */}
      <Section background="bg-white" className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {gallery.map((img, i) => (
            <motion.div 
              key={img.id}
              className="editorial-reveal group cursor-pointer"
              style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              onClick={() => setSelectedImg(img)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[24px] shadow-luxe group-hover:shadow-luxe-hover transition-all duration-700">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.8] brightness-95" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                    <ZoomIn size={24} />
                  </div>
                </div>
                {/* Meta Label */}
                <div className="absolute top-8 left-8">
                   <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">Foto 0{i+1}</span>
                </div>
              </div>
              <div className="mt-8 px-4 flex justify-between items-baseline">
                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F1113]">{img.alt || 'Visual Detail'}</p>
                 <span className="text-[9px] text-[#AF944F] font-bold tracking-[0.2em]">GS</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Modal Overlay: Professional Luxe Blur */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex items-center justify-center p-8 md:p-20"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-10 right-10 text-black hover:text-[#AF944F] transition-colors p-4 bg-gray-100 rounded-full"
              onClick={() => setSelectedImg(null)}
            >
              <X size={24} strokeWidth={2} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="max-w-4xl w-full h-[80vh] relative p-4"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImg.src} alt={selectedImg.alt} className="w-full h-full object-contain rounded-[32px]" />
              <div className="mt-8 text-center">
                 <p className="text-sm uppercase tracking-[0.5em] text-gray-400 font-serif italic-serif">{selectedImg.alt || 'View Details'}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
