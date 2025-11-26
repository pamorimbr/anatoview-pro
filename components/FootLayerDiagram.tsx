import React, { useState, useMemo } from 'react';
import { Muscle } from '../types';
import MuscleCard from './MuscleCard';
import { ChevronDown, Layers, ArrowDown } from 'lucide-react';

interface FootLayerDiagramProps {
  muscles: Muscle[];
}

const FootLayerDiagram: React.FC<FootLayerDiagramProps> = ({ muscles }) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  // Group muscles by subCompartment (Layers)
  const layers = useMemo(() => {
    const groups: Record<string, Muscle[]> = {
      '1ª Camada': [],
      '2ª Camada': [],
      '3ª Camada': [],
      '4ª Camada': []
    };
    
    // Filter only Planta muscles and populate groups
    muscles.forEach(m => {
      if (m.compartment === 'Planta' && m.subCompartment && groups[m.subCompartment]) {
        groups[m.subCompartment].push(m);
      }
    });
    
    return groups;
  }, [muscles]);

  const toggleLayer = (layerName: string) => {
    setActiveLayer(activeLayer === layerName ? null : layerName);
  };

  // Order of display: Layer 4 (Top) -> Layer 1 (Bottom)
  const layerOrder = ['4ª Camada', '3ª Camada', '2ª Camada', '1ª Camada'];

  // Definição de cores para bordas de conteúdo
  const contentBorderColors: Record<string, string> = {
      '4ª Camada': 'border-amber-300',
      '3ª Camada': 'border-orange-300',
      '2ª Camada': 'border-rose-300',
      '1ª Camada': 'border-slate-300',
  };

  const renderLayerContent = (layerName: string, layerMuscles: Muscle[]) => {
    const borderColor = contentBorderColors[layerName] || 'border-slate-200';

    // LAYOUT ESPECIAL PARA 4ª CAMADA (EMPILHAMENTO DORSAL/PLANTAR)
    if (layerName === '4ª Camada') {
        const dorsais = layerMuscles.find(m => m.name.includes('Dorsais'));
        const plantares = layerMuscles.find(m => m.name.includes('Plantares'));

        return (
            <div className={`flex flex-col gap-4 pl-4 border-l-[3px] ${borderColor} ml-6 py-3 relative`}>
                {/* Interósseos Dorsais (Topo) */}
                {dorsais && (
                    <div className="relative group">
                        <div className="flex items-center gap-2 mb-1.5">
                             <span className="text-[10px] font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-full border border-amber-200/50 uppercase tracking-wider">
                                Dorsal • Superior
                             </span>
                        </div>
                        <div className="relative z-10">
                            <MuscleCard muscle={dorsais} />
                        </div>
                        {/* Seta indicando relação espacial */}
                        <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 text-amber-300 z-0">
                            <ArrowDown className="w-3 h-3" />
                        </div>
                    </div>
                )}

                {/* Interósseos Plantares (Baixo) */}
                {plantares && (
                    <div className="relative">
                         <div className="flex items-center gap-2 mb-1.5">
                             <span className="text-[10px] font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-full border border-amber-200/50 uppercase tracking-wider">
                                Plantar • Inferior
                             </span>
                        </div>
                        <MuscleCard muscle={plantares} />
                    </div>
                )}
            </div>
        );
    }

    // LAYOUT PADRÃO (GRID) PARA OUTRAS CAMADAS
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4 border-l-[3px] ${borderColor} ml-6 py-3`}>
            {layerMuscles.map(muscle => (
                <div key={muscle.id} className="animate-in slide-in-from-left-2 duration-300">
                    <MuscleCard muscle={muscle} />
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6 animate-in pb-12">
      
      <div className="text-center space-y-1 mb-2">
        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
           <Layers className="w-5 h-5 text-rose-500" />
           Camadas da Planta do Pé
        </h3>
        <p className="text-slate-500 text-xs max-w-lg mx-auto">
           Visualização em corte: da profunda (topo) para a superficial (base).
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {layerOrder.map((layerName) => {
            const data = layers[layerName];
            const layerMuscles = data as Muscle[];
            const isActive = activeLayer === layerName;
            
            const themes = {
                '4ª Camada': 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
                '3ª Camada': 'bg-orange-50 border-orange-300 text-orange-900 hover:bg-orange-100',
                '2ª Camada': 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100',
                '1ª Camada': 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100',
            };

            const theme = themes[layerName as keyof typeof themes] || themes['1ª Camada'];

            return (
                <div key={layerName} className="relative z-10 w-full transition-all duration-300">
                    <button
                        onClick={() => toggleLayer(layerName)}
                        className={`
                            w-full p-3 sm:p-4 rounded-lg border-l-[6px] shadow-sm transition-all duration-200
                            flex items-center justify-between text-left group
                            ${theme}
                            ${isActive ? 'shadow-md ring-1 ring-slate-300 scale-[1.005]' : 'hover:scale-[1.002]'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-white/60 flex items-center justify-center border border-white/40 shadow-sm">
                                <span className="text-lg font-black opacity-70">{layerName.charAt(0)}</span>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Camada Plantar</h4>
                                <h2 className="text-base sm:text-lg font-black leading-none">{layerName}</h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                             <div className="hidden sm:flex flex-col items-end opacity-60">
                                 <span className="text-[10px] font-bold uppercase">{layerMuscles.length} músculos</span>
                             </div>
                             <div className={`p-1.5 rounded-full bg-white/40 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                                 <ChevronDown className="w-4 h-4" />
                             </div>
                        </div>
                    </button>

                    {/* EXPANDED CONTENT */}
                    <div className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${isActive ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                    `}>
                        {renderLayerContent(layerName, layerMuscles)}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default FootLayerDiagram;