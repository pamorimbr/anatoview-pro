import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Muscle } from '../types';
import { Zap, Activity, ChevronRight, X, Info, MapPin, ArrowRight, ScanEye, MousePointerClick, Heart, Droplets } from 'lucide-react';
import MuscleCard from './MuscleCard';
import FootLayerDiagram from './FootLayerDiagram';
import { normalizeTerm, getColorTheme, LensType, getKeywordForLens } from '../utils';

interface SchematicViewProps {
  muscles: Muscle[];
}

// --- CONFIGURAÇÃO VISUAL (Cores e Ícones) ---

const getLensConfig = (lens: LensType, isActive: boolean) => {
    // Base classes
    const baseClasses = "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 border shadow-sm";
    
    // Configurações de cores específicas para cada lente
    switch (lens) {
        case 'innervation': // Amarelo
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 ring-offset-1' 
                    : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`,
                icon: Zap
            };
        case 'vascularization': // Roxo
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-400 ring-offset-1' 
                    : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`,
                icon: Heart
            };
        case 'veins': // Azul Claro
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-cyan-500 text-white border-cyan-600 ring-2 ring-cyan-300 ring-offset-1' 
                    : 'bg-white text-cyan-600 border-cyan-200 hover:bg-cyan-50'}`,
                icon: Droplets
            };
        case 'action': // Verde
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 ring-offset-1' 
                    : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`,
                icon: Activity
            };
        case 'origin': // Vermelho
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-red-500 text-white border-red-600 ring-2 ring-red-300 ring-offset-1' 
                    : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`,
                icon: MapPin
            };
        case 'insertion': // Azul
            return {
                className: `${baseClasses} ${isActive 
                    ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400 ring-offset-1' 
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`,
                icon: ArrowRight
            };
        default:
            return { className: baseClasses, icon: Info };
    }
};

// --- PROCESSAMENTO DE DADOS ---

const getUniqueTerms = (muscles: Muscle[], type: LensType) => {
    if (muscles.length === 0) return [];
    const uniqueTerms = new Set<string>();
    muscles.forEach(m => {
        const value = m[type as keyof Muscle] as string;
        const cleanedValue = value.replace(/\([^)]*\)/g, '');
        const terms = cleanedValue.split(/,|\/|;|\+/);
        terms.forEach(t => {
            const normalized = normalizeTerm(t.trim(), type);
            if (normalized) uniqueTerms.add(normalized);
        });
    });
    return Array.from(uniqueTerms).sort();
};

// --- COMPONENTES DO MODAL ---

const MuscleBubble: React.FC<{ muscle: Muscle; theme: any }> = ({ muscle, theme }) => (
    <div className="h-full">
        <MuscleCard 
            muscle={muscle} 
            customTrigger={
                <div className={`w-full bg-white hover:bg-slate-50 border ${theme.border} rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left flex items-center justify-between group h-full cursor-pointer`}>
                    <span className="font-bold text-slate-700 text-sm truncate mr-2">{muscle.name}</span>
                    <div className={`p-1 rounded-full ${theme.soft} opacity-0 group-hover:opacity-100 transition-opacity`}>
                       <ChevronRight className={`w-3 h-3 ${theme.text}`} />
                    </div>
                </div>
            }
        />
    </div>
);

const MuscleCluster: React.FC<{ title: string; count: number; muscles: Muscle[] }> = ({ title, count, muscles }) => {
    const theme = getColorTheme(title);
    return (
        <div className={`bg-white rounded-3xl border-2 ${theme.border} p-5 shadow-sm overflow-hidden relative animate-fade-in`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${theme.soft} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none`}></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h4 className={`font-black text-lg flex items-center gap-3 ${theme.text}`}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.solid} text-white shadow-md`}>
                        {title.toLowerCase().includes('inervação') || title.toLowerCase().includes('nervo') ? <Zap className="w-4 h-4" fill="currentColor" /> :
                         title.toLowerCase().includes('artéria') ? <Heart className="w-4 h-4" fill="currentColor" /> :
                         title.toLowerCase().includes('veia') ? <Droplets className="w-4 h-4" fill="currentColor" /> :
                         <ScanEye className="w-4 h-4" />}
                    </span>
                    {title}
                </h4>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.soft} ${theme.text} border ${theme.border}`}>
                    {count} {count === 1 ? 'músculo' : 'músculos'}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                {muscles.map(m => (
                    <MuscleBubble key={m.id} muscle={m} theme={theme} />
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTES DO DIAGRAMA ---

const CentralHub: React.FC<{ title: string; total: number; lens: LensType }> = ({ title, total, lens }) => {
    // getKeywordForLens retorna 'origem' ou 'inserção' em PT-BR, que o getColorTheme entende
    const theme = getColorTheme(getKeywordForLens(lens));
    
    return (
        <div className={`
            w-28 h-28 rounded-full bg-white shadow-xl border-[6px] ${theme.border} 
            flex flex-col items-center justify-center z-20 relative animate-zoom-in 
            ring-8 ring-slate-50
        `}>
            <div className={`absolute inset-1 rounded-full border border-dashed ${theme.border} animate-spin-slow opacity-40`}></div>
            <span className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wide text-center leading-none px-1">
               {title}
            </span>
            <span className={`text-[10px] font-bold ${theme.text} ${theme.soft} px-3 py-0.5 rounded-full mt-1.5`}>
                {total}
            </span>
        </div>
    );
};

const SchematicNode: React.FC<{
    title: string;
    muscles: Muscle[];
    lens: LensType;
    onClick: () => void;
    customClass?: string;
}> = ({ title, muscles, lens, onClick, customClass }) => {
    if (!muscles || muscles.length === 0) return null;
    
    // Convert English lens key (e.g. 'origin') to Portuguese keyword (e.g. 'origem') 
    // so getColorTheme returns the correct color palette.
    const lensKeyword = getKeywordForLens(lens); 
    const theme = getColorTheme(lensKeyword);
    
    return (
        <div 
            onClick={onClick}
            className={`
                w-44 z-10 cursor-pointer group transition-all duration-300 hover:scale-105 hover:z-30
                ${customClass || ''}
            `}
        >
            <div className={`
                w-full bg-white rounded-xl shadow-sm border-2 ${theme.border} 
                p-2.5 flex flex-col gap-1.5 relative overflow-hidden group-hover:shadow-md transition-shadow
                hover:ring-2 ${theme.ring} ring-offset-2
            `}>
                <div className={`flex justify-between items-center border-b ${theme.border} pb-1.5 mb-0.5`}>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${theme.text}`}>{title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${theme.solid} text-white`}>
                        {muscles.length}
                    </span>
                </div>
                <div className="flex flex-col gap-1 pr-1 max-h-[140px] overflow-y-auto custom-scrollbar">
                    {getUniqueTerms(muscles, lens).map((term, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.solid} mt-1 flex-shrink-0`}></div>
                            <span className="text-[11px] font-semibold leading-tight text-slate-600 group-hover:text-slate-900 line-clamp-3">
                                {term}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RegionContainer: React.FC<{ 
    children: React.ReactNode, 
    regionName: string, 
    isGluteal?: boolean 
}> = ({ children, isGluteal }) => {
    return (
        <div className="relative bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-w-[350px] sm:min-w-[400px] h-auto min-h-[450px]">
            {/* Quadrant Indicators */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] bg-white px-2 z-0">
                Anterior
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] bg-white px-2 z-0">
                Posterior
            </div>
            {!isGluteal && (
                <>
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] bg-white px-2 z-0 origin-center">
                        Medial
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] bg-white px-2 z-0 origin-center">
                        Lateral
                    </div>
                </>
            )}

            {/* Decorative Borders */}
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-slate-100 pointer-events-none z-0"></div>
            
            {/* Content Area */}
            <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                {children}
            </div>
        </div>
    );
};

const SchematicView: React.FC<SchematicViewProps> = ({ muscles }) => {
  const [selectedGroup, setSelectedGroup] = useState<{ title: string; muscles: Muscle[] } | null>(null);
  const [activeLens, setActiveLens] = useState<LensType>('innervation');
  const [showInfo, setShowInfo] = useState(() => !sessionStorage.getItem('schematicInfoDismissed'));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedGroup(null);
    };
    if (selectedGroup) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [selectedGroup]);

  // --- DATA PROCESSING ---
  const musclesByRegion = useMemo(() => {
    const groups: Record<string, Muscle[]> = {};
    muscles.forEach(m => {
      if (!groups[m.region]) groups[m.region] = [];
      groups[m.region].push(m);
    });
    return groups;
  }, [muscles]);

  const groupedMusclesInModal = useMemo(() => {
    if (!selectedGroup) return [];
    const groups: Record<string, Muscle[]> = {};
    selectedGroup.muscles.forEach(m => {
        const value = m[activeLens as keyof Muscle] as string;
        const cleanedValue = value.replace(/\([^)]*\)/g, '');
        const terms = cleanedValue.split(/,|\/|;|\+/);
        terms.forEach(t => {
             const key = normalizeTerm(t.trim(), activeLens);
             if (key) {
                if (!groups[key]) groups[key] = [];
                if (!groups[key].find(existing => existing.id === m.id)) {
                    groups[key].push(m);
                }
             }
        });
    });
    return Object.entries(groups).sort(([, a], [, b]) => b.length - a.length).map(([title, items]) => ({ title, items }));
  }, [selectedGroup, activeLens]);

  // --- RENDER DIAGRAMAS ---

  const renderRegionDiagram = (regionName: string, regionMuscles: Muscle[]) => {
    const byCompartment: Record<string, Muscle[]> = {};
    regionMuscles.forEach(m => {
      let key = m.compartment;
      // Normalização dos nomes para mapeamento no layout
      if (key.includes('Anterior')) key = 'Anterior';
      else if (key.includes('Posterior')) key = 'Posterior';
      else if (key.includes('Medial')) key = 'Medial';
      else if (key.includes('Lateral')) key = 'Lateral';
      // Tratamento específico para Glútea
      else if (key.includes('Superficial') && regionName.includes('Glútea')) key = 'Superficial';
      else if (key.includes('Profunda') && regionName.includes('Glútea')) key = 'Profundo';
      
      if (!byCompartment[key]) byCompartment[key] = [];
      byCompartment[key].push(m);
    });

    const isGluteal = regionName.includes('Glútea');
    
    // Layout Dinâmico para Glútea (Vertical Stack)
    if (isGluteal) {
        return (
            <RegionContainer regionName={regionName} isGluteal={isGluteal}>
                <div className="flex flex-col items-center gap-8 w-full py-6">
                    {/* HUB */}
                    <CentralHub title={regionName} total={regionMuscles.length} lens={activeLens} />
                    
                    {/* POSTERIOR STACK (Profundo em cima, Superficial embaixo) */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Região Posterior</span>
                        <div className="flex flex-col gap-4">
                            <SchematicNode
                                title="Profundo"
                                muscles={byCompartment['Profundo']}
                                lens={activeLens}
                                onClick={() => setSelectedGroup({ title: `${regionName} - Profundo`, muscles: byCompartment['Profundo'] })}
                            />
                            <SchematicNode
                                title="Superficial"
                                muscles={byCompartment['Superficial']}
                                lens={activeLens}
                                onClick={() => setSelectedGroup({ title: `${regionName} - Superficial`, muscles: byCompartment['Superficial'] })}
                            />
                        </div>
                    </div>
                </div>
            </RegionContainer>
        );
    }

    // Layout Dinâmico em Grid para Coxa e Perna (Evita sobreposição)
    return (
      <RegionContainer regionName={regionName} isGluteal={isGluteal}>
            <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] gap-x-4 gap-y-6 items-center justify-items-center w-full h-full py-6">
                
                {/* Anterior (Top Center) */}
                <div className="col-start-2 row-start-1">
                    <SchematicNode
                        title="Anterior"
                        muscles={byCompartment['Anterior']}
                        lens={activeLens}
                        onClick={() => setSelectedGroup({ title: `${regionName} - Anterior`, muscles: byCompartment['Anterior'] })}
                    />
                </div>

                {/* Medial (Left) */}
                <div className="col-start-1 row-start-2 justify-self-end">
                    {byCompartment['Medial'] && (
                        <SchematicNode
                            title="Medial"
                            muscles={byCompartment['Medial']}
                            lens={activeLens}
                            onClick={() => setSelectedGroup({ title: `${regionName} - Medial`, muscles: byCompartment['Medial'] })}
                        />
                    )}
                </div>

                {/* HUB (Center) */}
                <div className="col-start-2 row-start-2 z-20">
                    <CentralHub title={regionName} total={regionMuscles.length} lens={activeLens} />
                </div>

                {/* Lateral (Right) */}
                <div className="col-start-3 row-start-2 justify-self-start">
                     {byCompartment['Lateral'] && (
                        <SchematicNode
                            title="Lateral"
                            muscles={byCompartment['Lateral']}
                            lens={activeLens}
                            onClick={() => setSelectedGroup({ title: `${regionName} - Lateral`, muscles: byCompartment['Lateral'] })}
                        />
                    )}
                </div>

                {/* Posterior (Bottom Center) */}
                <div className="col-start-2 row-start-3">
                     <SchematicNode
                        title="Posterior"
                        muscles={byCompartment['Posterior']}
                        lens={activeLens}
                        onClick={() => setSelectedGroup({ title: `${regionName} - Posterior`, muscles: byCompartment['Posterior'] })}
                    />
                </div>
            </div>
      </RegionContainer>
    );
  };

  const handleDismissInfo = () => {
    setShowInfo(false);
    sessionStorage.setItem('schematicInfoDismissed', 'true');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-10 pb-20 animate-in">
       {/* Info Box */}
       {showInfo && (
         <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 relative max-w-3xl mx-auto shadow-sm flex items-start gap-4">
            <button onClick={handleDismissInfo} className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-500">
                <X className="w-4 h-4" />
            </button>
            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 shrink-0">
                <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-indigo-900 text-sm mb-1">Modo Esquema Interativo</h3>
                <p className="text-indigo-700 text-xs leading-relaxed">
                    Clique nos blocos para ver detalhes. Use os botões coloridos acima para mudar o filtro (Inervação, Artéria, etc).
                    O layout se ajusta dinamicamente para mostrar as informações sem sobreposição.
                </p>
            </div>
         </div>
       )}

       {/* Lens Switcher */}
       <div className="sticky top-20 z-30 flex justify-center py-3 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 border-b border-slate-100 shadow-sm mb-8">
          <div className="flex gap-3 overflow-x-auto max-w-full pb-1 hide-scrollbar px-2">
            {(['innervation', 'vascularization', 'veins', 'action', 'origin', 'insertion'] as LensType[]).map(lens => {
                const config = getLensConfig(lens, activeLens === lens);
                const Icon = config.icon;
                return (
                    <button
                        key={lens}
                        onClick={() => setActiveLens(lens)}
                        className={config.className}
                    >
                        <Icon className="w-4 h-4" />
                        {getKeywordForLens(lens) || lens}
                    </button>
                )
            })}
          </div>
       </div>

       {/* MAIN DIAGRAMS AREA - ALIGNED HORIZONTALLY */}
       <div className="flex flex-wrap justify-center items-start gap-8 px-4 w-full">
           {/* GLÚTEA */}
           {musclesByRegion['Região Glútea'] && renderRegionDiagram('Região Glútea', musclesByRegion['Região Glútea'])}
           
           {/* COXA */}
           {musclesByRegion['Coxa'] && renderRegionDiagram('Coxa', musclesByRegion['Coxa'])}
           
           {/* PERNA */}
           {musclesByRegion['Perna'] && renderRegionDiagram('Perna', musclesByRegion['Perna'])}
       </div>

       {/* PÉ (Separado, em baixo) */}
       {musclesByRegion['Pé'] && (
           <div className="mt-12 border-t border-slate-200 pt-10">
                <div className="flex justify-center mb-6">
                    <span className="bg-white border border-slate-200 text-slate-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        Região do Pé
                    </span>
                </div>
                <div className="flex justify-center">
                    <FootLayerDiagram muscles={musclesByRegion['Pé']} />
                </div>
           </div>
       )}

       {/* MODAL PORTAL */}
       {selectedGroup && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
             <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
                onClick={() => setSelectedGroup(null)}
             ></div>

             <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-zoom-in border border-white/20">
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                {React.createElement(getLensConfig(activeLens, true).icon, { className: "w-3 h-3" })}
                                {getKeywordForLens(activeLens)}
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">
                            {selectedGroup.title}
                        </h2>
                    </div>
                    <button 
                        onClick={() => setSelectedGroup(null)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                    {groupedMusclesInModal.length > 0 ? (
                        <div className="space-y-8">
                             {groupedMusclesInModal.map((group, idx) => (
                                 <MuscleCluster 
                                    key={idx} 
                                    title={group.title} 
                                    count={group.items.length} 
                                    muscles={group.items} 
                                 />
                             ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <Info className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Nenhuma informação encontrada para este critério.</p>
                        </div>
                    )}
                </div>
             </div>
        </div>,
        document.body
       )}
    </div>
  );
};

export default SchematicView;