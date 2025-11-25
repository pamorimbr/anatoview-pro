import React, { useState, useMemo } from 'react';
import { Muscle } from '../types';
import MuscleCard from './MuscleCard';
import { LensType, normalizeTerm, getColorTheme } from '../utils';
import { Zap, Activity, MapPin, ArrowRight, ScanEye, Search, Heart, Droplets } from 'lucide-react';

interface RelationsViewProps {
  muscles: Muscle[];
}

type GroupedMuscles = Record<string, Muscle[]>;

const LensButton = ({ id, label, icon: Icon, activeLens, onClick }: { id: LensType, label: string, icon: any, activeLens: LensType, onClick: (lens: LensType) => void }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        px-4 py-2 rounded-full text-sm font-semibold flex items-center transition-all duration-200 flex-shrink-0
        ${activeLens === id 
            ? 'bg-slate-800 text-white shadow-md scale-105' 
            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:text-slate-800'}
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
);

const RelationsView: React.FC<RelationsViewProps> = ({ muscles }) => {
  const [activeLens, setActiveLens] = useState<LensType>('origin');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const groupedData = useMemo<GroupedMuscles>(() => {
    const groups: GroupedMuscles = {};
    muscles.forEach(muscle => {
      const value = muscle[activeLens];
      if (typeof value !== 'string' || !value) {
        return;
      }
      
      // CORREÇÃO: Remove o conteúdo dos parênteses
      const cleanedValue = value.replace(/\([^)]*\)/g, '');
      const terms = cleanedValue.split(/,|\/|;|\+/);
      
      const uniqueNormalizedTerms = new Set<string>();
      terms.forEach(t => {
        const normalized = normalizeTerm(t.trim(), activeLens);
        if (normalized) {
          uniqueNormalizedTerms.add(normalized);
        }
      });

      uniqueNormalizedTerms.forEach(term => {
        if (!groups[term]) {
          groups[term] = [];
        }
        groups[term].push(muscle);
      });
    });
    return groups;
  }, [muscles, activeLens]);

  const filteredAndSortedKeys = useMemo(() => {
    return Object.keys(groupedData)
      .filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')); // Ordenação alfabética
  }, [groupedData, searchTerm]);

  // Auto-select the first key when the lens or search term changes
  React.useEffect(() => {
    if (filteredAndSortedKeys.length > 0) {
      setSelectedKey(filteredAndSortedKeys[0]);
    } else {
      setSelectedKey(null);
    }
  }, [filteredAndSortedKeys, activeLens]);


  const selectedMuscles = (selectedKey && groupedData[selectedKey]) || [];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[80vh] flex flex-col animate-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ScanEye className="w-6 h-6 text-medical-600" />
                    Explorador de Relações
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                Descubra conexões ocultas: agrupe músculos por características comuns.
                </p>
            </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2 justify-start items-center p-1 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Critério:</span>
            <LensButton id="origin" label="Origem" icon={MapPin} activeLens={activeLens} onClick={setActiveLens} />
            <LensButton id="insertion" label="Inserção" icon={ArrowRight} activeLens={activeLens} onClick={setActiveLens} />
            <LensButton id="innervation" label="Inervação" icon={Zap} activeLens={activeLens} onClick={setActiveLens} />
            <LensButton id="vascularization" label="Artérias" icon={Heart} activeLens={activeLens} onClick={setActiveLens} />
            <LensButton id="veins" label="Veias" icon={Droplets} activeLens={activeLens} onClick={setActiveLens} />
            <LensButton id="action" label="Ação" icon={Activity} activeLens={activeLens} onClick={setActiveLens} />
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
        {/* Left Panel: List of Keys */}
        <div className="col-span-1 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-3 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Filtrar ${activeLens}...`}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar flex-grow bg-slate-50/30">
            {filteredAndSortedKeys.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                {filteredAndSortedKeys.map(key => {
                    const theme = getColorTheme(key);
                    const isSelected = selectedKey === key;
                    return (
                    <li key={key}>
                        <button
                        onClick={() => setSelectedKey(key)}
                        className={`w-full text-left p-3.5 flex justify-between items-center transition-all duration-200
                            ${isSelected ? 'bg-white shadow-md border-l-4 ' + theme.border.replace('border-', 'border-l-') : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                        >
                        <span className={`text-sm truncate pr-2 ${isSelected ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{key}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? `${theme.soft} ${theme.text}` : 'bg-slate-100 text-slate-400'}`}>
                            {groupedData[key].length}
                        </span>
                        </button>
                    </li>
                    );
                })}
                </ul>
            ) : (
                <div className="p-8 text-center text-sm text-slate-400 flex flex-col items-center">
                    <Search className="w-8 h-8 mb-2 opacity-20" />
                    Nenhum resultado encontrado.
                </div>
            )}
          </div>
        </div>

        {/* Right Panel: Muscle Cards */}
        <div className="md:col-span-2 lg:col-span-3 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          {selectedKey && selectedMuscles.length > 0 ? (
            <div className="p-4 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${getColorTheme(selectedKey).soft}`}>
                        {activeLens === 'innervation' && <Zap className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                        {activeLens === 'vascularization' && <Heart className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                        {activeLens === 'veins' && <Droplets className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                        {activeLens === 'origin' && <MapPin className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                        {activeLens === 'insertion' && <ArrowRight className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                        {activeLens === 'action' && <Activity className={`w-6 h-6 ${getColorTheme(selectedKey).text}`} />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                            {selectedKey}
                        </h3>
                        <p className="text-sm font-medium text-slate-500">
                            Encontrado em <span className="text-slate-900 font-bold">{selectedMuscles.length}</span> músculos
                        </p>
                    </div>
                </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {selectedMuscles.map(muscle => (
                  <MuscleCard key={`${muscle.id}-${selectedKey}`} muscle={muscle} />
                ))}
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <ScanEye className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Selecione um item</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                    Clique em uma opção na lista à esquerda para ver os detalhes.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationsView;