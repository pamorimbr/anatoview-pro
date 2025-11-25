import React, { useState, useMemo } from 'react';
import { Muscle } from '../types';
import { Zap, Activity, ChevronRight, X, Info, MapPin, ArrowRight, ScanEye, MousePointerClick, Heart, Droplets } from 'lucide-react';
import MuscleCard from './MuscleCard';
import FootLayerDiagram from './FootLayerDiagram';
import { normalizeTerm, getColorTheme, LensType } from '../utils';

interface SchematicViewProps {
  muscles: Muscle[];
}

// --- PROCESSAMENTO DE DADOS (Lista de Termos Únicos) ---

const getUniqueTerms = (muscles: Muscle[], type: LensType) => {
    if (muscles.length === 0) return [];

    const uniqueTerms = new Set<string>();
    
    muscles.forEach(m => {
        const value = m[type as keyof Muscle] as string;
        // CORREÇÃO: Remove o conteúdo dos parênteses (ex: L5, S1) antes de separar
        const cleanedValue = value.replace(/\([^)]*\)/g, '');
        // Divide por vírgula, barra, ponto e vírgula ou sinal de mais
        const terms = cleanedValue.split(/,|\/|;|\+/);
        terms.forEach(t => {
            const normalized = normalizeTerm(t.trim(), type);
            if (normalized) uniqueTerms.add(normalized);
        });
    });

    // Converte para array e ordena alfabeticamente
    return Array.from(uniqueTerms).sort();
};

// --- COMPONENTES AUXILIARES DO MODAL ---

const MuscleBubble: React.FC<{ muscle: Muscle; theme: any }> = ({ muscle, theme }) => {
  return (
    <div className="h-full">
        <MuscleCard 
            muscle={muscle} 
            customTrigger={
                <div 
                    className={`w-full bg-white hover:bg-slate-50 border ${theme.border} rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left flex items-center justify-between group h-full cursor-pointer`}
                >
                    <span className="font-bold text-slate-700 text-sm truncate mr-2">{muscle.name}</span>
                    <div className={`p-1 rounded-full ${theme.soft} opacity-0 group-hover:opacity-100 transition-opacity`}>
                       <ChevronRight className={`w-3 h-3 ${theme.text}`} />
                    </div>
                </div>
            }
        />
    </div>
  );
};

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

// --- COMPONENTES DO DIAGRAMA (HUB & SATELLITES) ---

const CentralHub: React.FC<{ title: string; total: number; lens: LensType }> = ({ title, total, lens }) => {
    const theme = getColorTheme(lens === 'innervation' ? 'nervo' : lens === 'vascularization' ? 'artéria' : lens === 'veins' ? 'veia' : 'ação');
    const titleParts = title.split(' ');

    return (
        <div className={`
            w-24 h-24 rounded-full bg-white shadow-xl border-4 ${theme.border} 
            flex flex-col items-center justify-center z-20 relative animate-zoom-in 
            ring-4 ring-slate-50
        `}>
            <div className={`absolute inset-1 rounded-full border border-dashed ${theme.border} animate-spin-slow opacity-40`}></div>
            
            <div className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wide text-center leading-tight px-1 break-words w-full">
               {titleParts.map((part, i) => <div key={i}>{part}</div>)}
            </div>
            <span className={`text-[10px] font-bold ${theme.text} ${theme.soft} px-2 py-0.5 rounded-full mt-1`}>
                {total} Total
            </span>
        </div>
    );
};

const SchematicNode: React.FC<{
    title: string;
    muscles: Muscle[];
    lens: LensType;
    onClick: () => void;
    positionClass: string;
    alignClass?: string;
}> = ({ title, muscles, lens, onClick, positionClass, alignClass = "" }) => {
    if (!muscles || muscles.length === 0) return null;

    const terms = getUniqueTerms(muscles, lens);
    const theme = terms.length > 0 ? getColorTheme(terms[0]) : getColorTheme('');

    return (
        <div 
            onClick={onClick}
            className={`absolute ${positionClass} w-40 z-10 cursor-pointer group transition-all duration-300 hover:scale-105 hover:z-30 flex ${alignClass}`}
        >
            <div className={`
                w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-md border ${theme.border} 
                p-2.5 flex flex-col gap-1 relative overflow-hidden group-hover:shadow-lg transition-shadow
                hover:ring-2 ${theme.ring} ring-offset-2
            `}>
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-1 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate w-20">{title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${theme.soft} ${theme.text}`}>
                        {muscles.length}
                    </span>
                </div>

                {/* Content List */}
                <div className="flex flex-col gap-1 max-h-[85px] overflow-y-auto custom-scrollbar pr-1">
                    {terms.map((term, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.solid} mt-1 flex-shrink-0`}></div>
                            <span className={`text-[10px] font-semibold leading-tight text-slate-600 group-hover:text-slate-900`}>
                                {term}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SchematicView: React.FC<SchematicViewProps> = ({ muscles }) => {
  const [selectedGroup, setSelectedGroup] = useState<{ title: string; muscles: Muscle[] } | null>(null);
  const [activeLens, setActiveLens] = useState<LensType>('innervation');
  const [showInfo, setShowInfo] = useState(() => !sessionStorage.getItem('schematicInfoDismissed'));

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
        // CORREÇÃO: Remove o conteúdo dos parênteses
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

    return Object.entries(groups)
        .sort(([, a], [, b]) => b.length - a.length)
        .map(([title, items]) => ({ title, items }));
  }, [selectedGroup, activeLens]);


  // --- RENDERING ---

  const renderRegionDiagram = (regionName: string, regionMuscles: Muscle[]) => {
    if (regionName === 'Pé') {
        return (
            <div className="w-full flex justify-center py-6">
                <FootLayerDiagram muscles={regionMuscles} />
            </div>
        );
    }

    const byCompartment: Record<string, Muscle[]> = {};
    
    regionMuscles.forEach(m => {
      let key = m.compartment;
      // Simplifica nomes de compartimentos para chaves de layout
      if (key.includes('Anterior')) key = 'Anterior';
      else if (key.includes('Posterior')) key = 'Posterior';
      else if (key.includes('Medial')) key = 'Medial';
      else if (key.includes('Lateral')) key = 'Lateral';
      else if (key.includes('Superficial') && regionName.includes('Glútea')) key = 'Superficial';
      else if (key.includes('Profunda') && regionName.includes('Glútea')) key = 'Profunda';
      else if (key.includes('Dorso')) key = 'Dorso';
      
      if (!byCompartment[key]) byCompartment[key] = [];
      byCompartment[key].push(m);
    });

    const positions: Record<string, { pos: string, align: string }> = {};
    
    if (regionName.includes('Coxa') || regionName.includes('Perna')) {
      positions['Anterior'] = { pos: 'top-0 left-1/2 -translate-x-1/2', align: 'justify-center' };
      positions['Posterior'] = { pos: 'bottom-0 left-1/2 -translate-x-1/2', align: 'justify-center' };
      positions['Medial'] = { pos: 'right-0 top-1/2 -translate-y-1/2', align: 'justify-end' };
      positions['Lateral'] = { pos: 'left-0 top-1/2 -translate-y-1/2', align: 'justify-start' };
    } else if (regionName.includes('Glútea')) {
      positions['Superficial'] = { pos: 'top-4 left-1/2 -translate-x-1/2', align: 'justify-center' };
      positions['Profunda'] = { pos: 'bottom-4 left-1/2 -translate-x-1/2', align: 'justify-center' };
    } else {
      const keys = Object.keys(byCompartment);
      if (keys[0]) positions[keys[0]] = { pos: 'top-0 left-1/2 -translate-x-1/2', align: 'justify-center' };
      if (keys[1]) positions[keys[1]] = { pos: 'bottom-0 left-1/2 -translate-x-1/2', align: 'justify-center' };
      if (keys[2]) positions[keys[2]] = { pos: 'right-0 top-1/2 -translate-y-1/2', align: 'justify-end' };
      if (keys[3]) positions[keys[3]] = { pos: 'left-0 top-1/2 -translate-y-1/2', align: 'justify-start' };
    }
    
    return (
      <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center select-none">
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none text-slate-300">
            {(positions['Anterior'] || positions['Superficial']) && (
                <g>
                    <path d="M50% 50% L50% 18%" className="stroke-current stroke-2" fill="none" />
                    <circle cx="50%" cy="18%" r="4" className="fill-current" />
                </g>
            )}
            {(positions['Posterior'] || positions['Profunda']) && (
                <g>
                    <path d="M50% 50% L50% 82%" className="stroke-current stroke-2" fill="none" />
                    <circle cx="50%" cy="82%" r="4" className="fill-current" />
                </g>
            )}
            {positions['Lateral'] && (
                 <g>
                    <path d="M50% 50% L18% 50%" className="stroke-current stroke-2" fill="none" />
                    <circle cx="18%" cy="50%" r="4" className="fill-current" />
                 </g>
            )}
            {positions['Medial'] && (
                 <g>
                    <path d="M50% 50% L82% 50%" className="stroke-current stroke-2" fill="none" />
                    <circle cx="82%" cy="50%" r="4" className="fill-current" />
                 </g>
            )}
         </svg>

         {Object.entries(positions).map(([comp, config]) => {
             if (!byCompartment[comp]) return null;
             return (
                 <SchematicNode
                    key={comp}
                    title={comp}
                    muscles={byCompartment[comp]}
                    lens={activeLens}
                    onClick={() => setSelectedGroup({ title: `${regionName} - ${comp}`, muscles: byCompartment[comp] })}
                    positionClass={config.pos}
                    alignClass={config.align}
                 />
             );
         })}

         <CentralHub title={regionName} total={regionMuscles.length} lens={activeLens} />
      </div>
    );
  };

  const LensButton = ({ id, label, icon: Icon }: { id: LensType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveLens(id)}
      className={`
        px-3 py-1.5 rounded-full text-xs font-semibold flex items-center transition-all duration-200 flex-shrink-0
        ${activeLens === id 
          ? 'bg-slate-800 text-white shadow-md scale-105 ring-2 ring-slate-200 ring-offset-1' 
          : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:text-slate-800'}
      `}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {label}
    </button>
  );

  return (
    <div className="relative min-h-[600px] animate-fade-in bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      
      {/* Barra de Ferramentas da Lente */}
      <div className="sticky top-20 z-40 mb-8 pt-4 flex flex-col items-center gap-4">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-lg flex flex-wrap gap-2 justify-center max-w-full overflow-x-auto hide-scrollbar ring-1 ring-slate-100">
            <LensButton id="innervation" label="Inervação" icon={Zap} />
            <LensButton id="vascularization" label="Artérias" icon={Heart} />
            <LensButton id="veins" label="Veias" icon={Droplets} />
            <LensButton id="action" label="Ação" icon={Activity} />
            <LensButton id="origin" label="Origem" icon={MapPin} />
            <LensButton id="insertion" label="Inserção" icon={ArrowRight} />
        </div>
        
        {showInfo && (
          <div className="bg-medical-50/95 backdrop-blur border border-medical-200 rounded-xl p-3 max-w-md mx-auto flex items-start gap-3 animate-slide-up shadow-sm">
            <div className="bg-medical-100 p-1.5 rounded-full">
                <Info className="w-4 h-4 text-medical-600" />
            </div>
            <div className="flex-grow">
              <p className="text-xs text-medical-800 leading-relaxed font-medium">
                <strong>Modo Diagrama:</strong> Visualize as relações anatômicas conectadas. Clique nos compartimentos (ao redor) para ver os detalhes completos.
              </p>
            </div>
            <button 
              onClick={() => {
                setShowInfo(false);
                sessionStorage.setItem('schematicInfoDismissed', 'true');
              }}
              className="p-1 text-medical-400 hover:text-medical-600 hover:bg-medical-100 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-12 pb-12">
        {Object.entries(musclesByRegion).map(([region, regionMuscles]) => (
          <div key={region} className={`flex flex-col items-center ${region === 'Pé' ? 'w-full' : 'w-auto'}`}>
             {region !== 'Pé' && (
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-1">{region}</span>
                 </div>
             )}
            {renderRegionDiagram(region, regionMuscles as Muscle[])}
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => setSelectedGroup(null)}
          ></div>
          
          <div className="bg-slate-50 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative animate-zoom-in border border-white/20">
            <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20 shadow-sm">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedGroup.title}</h3>
                <p className="text-slate-500 text-xs mt-0.5 flex items-center font-medium">
                    <MousePointerClick className="w-3.5 h-3.5 mr-1 text-medical-500" />
                    Lente ativa: <span className="text-medical-600 ml-1 uppercase bg-medical-50 px-1.5 rounded text-[10px] font-bold border border-medical-100">{activeLens}</span>
                </p>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar bg-slate-50">
                <div className="space-y-6">
                    {groupedMusclesInModal.map((group) => (
                        <MuscleCluster 
                            key={group.title} 
                            title={group.title} 
                            count={group.items.length} 
                            muscles={group.items} 
                        />
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchematicView;