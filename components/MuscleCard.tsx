import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Muscle } from '../types';
import { Activity, Zap, MapPin, ArrowRight, X, Layers, Heart, Droplets } from 'lucide-react';

interface MuscleCardProps {
  muscle: Muscle;
  customTrigger?: React.ReactNode; // Permite usar um botão customizado (como no Esquema)
}

const MuscleCard: React.FC<MuscleCardProps> = ({ muscle, customTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Previne scroll no fundo
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  // Helper para formatar o nome do compartimento
  const displayCompartment = (muscle: Muscle) => {
     if (muscle.region === 'Pé' && muscle.compartment === 'Planta') {
         return 'Visão de plantar para dorsal';
     }
     return muscle.compartment;
  };

  // Conteúdo do Modal isolado para uso no Portal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Backdrop (Fundo escuro e desfocado) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={closeModal}
      ></div>

      {/* Janela do Modal */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar relative z-10 animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 flex justify-between items-start z-20">
          <div>
            <h2 className="text-2xl font-black text-rose-950 leading-tight">{muscle.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{muscle.region}</span>
              <span>•</span>
              <span>{displayCompartment(muscle)}</span>
              {muscle.subCompartment && (
                 <>
                    <span>•</span>
                    <span className="flex items-center text-slate-400"><Layers className="w-3 h-3 mr-1" />{muscle.subCompartment}</span>
                 </>
              )}
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-6">
           {/* Origin & Insertion Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* ORIGEM - Vermelho */}
              <div className="bg-red-50 rounded-xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-500 p-1.5 rounded-lg text-white shadow-sm">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-red-700 uppercase tracking-wider text-sm">Origem</h4>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">{muscle.origin}</p>
              </div>

              {/* INSERÇÃO - Azul */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-500 p-1.5 rounded-lg text-white shadow-sm">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-blue-700 uppercase tracking-wider text-sm">Inserção</h4>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{muscle.insertion}</p>
              </div>
           </div>

           {/* Grid para Inervação e Vascularização */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* INERVAÇÃO - Amarelo */}
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-amber-500 p-1.5 rounded-lg text-white shadow-sm">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <h4 className="font-bold text-amber-700 uppercase tracking-wider text-sm">Inervação</h4>
                    </div>
                    <p className="text-slate-900 font-bold text-lg">{muscle.innervation}</p>
                </div>

                {/* VASCULARIZAÇÃO (ARTÉRIAS) - Violeta */}
                <div className="bg-violet-50 rounded-xl p-5 border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-violet-500 p-1.5 rounded-lg text-white shadow-sm">
                            <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <h4 className="font-bold text-violet-700 uppercase tracking-wider text-sm">Artérias</h4>
                    </div>
                    <p className="text-slate-900 font-bold text-lg leading-snug">{muscle.vascularization}</p>
                </div>
           </div>

           {/* DRENAGEM VENOSA - Ciano */}
           <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                  <div className="bg-cyan-500 p-1.5 rounded-lg text-white shadow-sm">
                      <Droplets className="w-5 h-5 fill-current" />
                  </div>
                  <h4 className="font-bold text-cyan-700 uppercase tracking-wider text-sm">Veias (Drenagem)</h4>
              </div>
              <p className="text-slate-900 font-bold text-lg leading-snug">{muscle.veins}</p>
           </div>

           {/* AÇÃO - Verde */}
           <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                  <div className="bg-emerald-500 p-1.5 rounded-lg text-white shadow-sm">
                      <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-emerald-700 uppercase tracking-wider text-sm">Ação</h4>
              </div>
              <p className="text-slate-800 font-medium text-lg leading-relaxed">{muscle.action}</p>
           </div>
        </div>

        {/* Footer Decorativo */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">AnatoView Pro • Atlas Interativo</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* TRIGGER: O elemento clicável na tela */}
      <div onClick={openModal} className="cursor-pointer h-full">
        {customTrigger ? (
          customTrigger
        ) : (
          /* Card Padrão (Usado na Grade e Camadas) */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 hover:shadow-md hover:border-medical-200 transition-all duration-200 h-full flex flex-col justify-center group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-medical-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
            
            <h3 className="text-sm font-bold text-rose-950 group-hover:text-medical-700 transition-colors relative z-10">
              {muscle.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 relative z-10">
              {muscle.region} • {displayCompartment(muscle)}
              {muscle.subCompartment && <span className="text-slate-400 font-normal block text-xs mt-0.5">{muscle.subCompartment}</span>}
            </p>
            
            <div className="mt-1.5 flex items-center text-xs font-bold text-medical-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* RENDERIZAR O MODAL FORA DA ÁRVORE DOM ATUAL (NO BODY) */}
      {isOpen && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default MuscleCard;