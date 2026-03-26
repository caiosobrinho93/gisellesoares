import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail, Star } from 'lucide-react';
import { Container } from '../ui/Section';

export default function Footer() {
  return (
    <footer className="bg-[#0F1113] text-white pt-24 pb-12 border-t border-white/5">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <Link to="/" className="flex flex-col mb-8">
              <span className="text-2xl font-black tracking-tighter uppercase">Giselle Soares</span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#AF944F]">Curadoria de Unhas</span>
            </Link>
            <p className="text-gray-400 text-sm font-normal leading-relaxed italic">
              Elevando a estética de unhas ao patamar de rituais de luxo e precisão técnica.
            </p>
          </div>

          <div>
             <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-10">Explorar</h4>
             <ul className="space-y-6">
                {['Início', 'Galeria', 'Esmaltes', 'Agendar'].map((item) => (
                  <li key={item}>
                    <Link to={item === 'Início' ? '/' : `/${item.toLowerCase()}`} className="text-sm font-light text-gray-400 hover:text-white transition-all uppercase tracking-widest">{item}</Link>
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-10">Suporte</h4>
             <ul className="space-y-6 text-sm font-normal text-gray-400 italic">
                <li className="flex items-center gap-4"><Phone size={16} /> (17) 99123-4567</li>
                <li className="flex items-center gap-4"><Mail size={16} /> contato@gisellesoares.com.br</li>
                <li className="flex items-center gap-4"><MapPin size={16} /> Votuporanga, SP</li>
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#AF944F] mb-10">Social</h4>
             <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-sm font-light text-gray-400 hover:text-white transition-all">
                <Instagram size={24} /> <span className="uppercase tracking-[0.3em] font-bold text-[10px]">Instagram</span>
             </a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">
              © {new Date().getFullYear()} Giselle Soares — Estética de Alto Padrão.
           </p>
           <div className="flex items-center gap-8">
              <Star className="text-[#AF944F]" size={16} />
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-500">Desenvolvido com Rigor Técnico</p>
           </div>
        </div>
      </Container>
    </footer>
  );
}
