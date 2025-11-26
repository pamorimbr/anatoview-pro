import React, { useState, useMemo } from 'react';
import { Muscle } from '../types';
import MuscleCard from './MuscleCard';
import { ChevronDown, Layers, Scan, ArrowDown } from 'lucide-react';

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

  const renderLayerContent = (layerName: string, layerMuscles: Muscle[]) => {
    // LAYOUT ESPECIAL PARA 4ª CAMADA (EMPILHAMENTO DORSAL/PLANTAR)
    if (layerName === '4ª Camada') {
        const dorsais = layerMuscles.find(m => m.name.includes('Dorsais'));
        const plantares = layerMuscles.find(m => m.name.includes('Plantares'));

        return (
            <div className="flex flex-col gap-6 pl-2 border-l-4 border-amber-200 ml-4 py-2 relative">
                {/* Interósseos Dorsais (Topo) */}
                {dorsais && (
                    <div className="relative group">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-full hidden sm:flex flex-col items-end pr-2">
                             <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Dorsal</span>
                             <span className="text-[9px] text-slate-400">Superior</span>
                        </div>
                        <div className="relative z-10">
                            <MuscleCard muscle={dorsais} />
                        </div>
                        {/* Seta indicando relação espacial */}
                        <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-amber-300 z-0">
                            <ArrowDown className="w-4 h-4" />
                        </div>
                    </div>
                )}

                {/* Interósseos Plantares (Baixo) */}
                {plantares && (
                    <div className="relative">
                         <div className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-full hidden sm:flex flex-col items-end pr-2">
                             <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Plantar</span>
                             <span className="text-[9px] text-slate-400">Inferior</span>
                        </div>
                        <MuscleCard muscle={plantares} />
                    </div>
                )}
            </div>
        );
    }

    // LAYOUT PADRÃO (GRID) PARA OUTRAS CAMADAS
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-2 border-l-2 border-slate-200 ml-4">
            {layerMuscles.map(muscle => (
                <div key={muscle.id} className="animate-in slide-in-from-left-2 duration-300">
                    <MuscleCard muscle={muscle} />
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in pb-12">
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
           <Layers className="w-6 h-6 text-rose-500" />
           Camadas da Planta do Pé
        </h3>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
           Visualização em corte: da camada mais profunda (topo da lista) para a mais superficial (base).
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {layerOrder.map((layerName) => {
            const data = layers[layerName];
            const layerMuscles = data as Muscle[];
            const isActive = activeLayer === layerName;
            
            const themes = {
                '4ª Camada': 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200',
                '3ª Camada': 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
                '2ª Camada': 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200',
                '1ª Camada': 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200',
            };

            const theme = themes[layerName as keyof typeof themes] || themes['1ª Camada'];

            return (
                <div key={layerName} className="relative z-10 w-full transition-all duration-500">
                    <button
                        onClick={() => toggleLayer(layerName)}
                        className={`
                            w-full p-6 rounded-xl border-l-8 shadow-sm transition-all duration-200
                            flex items-center justify-between text-left group
                            ${theme}
                            ${isActive ? 'shadow-md ring-2 ring-slate-400 ring-offset-2 scale-[1.01]' : 'hover:scale-[1.005]'}
                        `}
                    >
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/40 flex items-center justify-center border border-white/20 shadow-inner">
                                <span className="text-2xl font-black opacity-70">{layerName.charAt(0)}</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold uppercase tracking-wider opacity-60 text-xs mb-1">Camada Plantar</h4>
                                <h2 className="text-xl sm:text-2xl font-black leading-none">{layerName}</h2>
                                {isActive && (
                                    <p className="text-xs font-semibold mt-2 opacity-70 flex items-center">
                                        <Scan className="w-3 h-3 mr-1" />
                                        Visualizando detalhes
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <div className="hidden sm:flex flex-col items-end opacity-60">
                                 <span className="text-xs font-bold uppercase">Contém</span>
                                 <span className="text-lg font-bold">{layerMuscles.length} músculos</span>
                             </div>
                             <div className={`p-2 rounded-full bg-white/30 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                                 <ChevronDown className="w-6 h-6" />
                             </div>
                        </div>
                    </button>

                    {/* EXPANDED CONTENT */}
                    <div className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${isActive ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
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