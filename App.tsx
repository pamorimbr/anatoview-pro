import React, { useState, useMemo } from 'react';
import { ANATOMY_DATA } from './constants';
import MuscleCard from './components/MuscleCard';
import SchematicView from './components/SchematicView';
import RelationsView from './components/RelationsView';
import QuizView from './components/QuizView';
import { ViewMode } from './types';
import { Search, Grid, List, Activity, Filter, X, Network, GitMerge, ChevronDown, HeartHandshake, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Todos');
  const [selectedCompartment, setSelectedCompartment] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Extract unique regions
  const regions = useMemo(() => {
    const allRegions = ANATOMY_DATA.map(m => m.region);
    return ['Todos', ...Array.from(new Set(allRegions))];
  }, []);

  // Extract compartments based on selected region
  const compartments = useMemo(() => {
    if (selectedRegion === 'Todos') return ['Todos'];
    const regionMuscles = ANATOMY_DATA.filter(m => m.region === selectedRegion);
    const allCompartments = regionMuscles.map(m => m.compartment);
    return ['Todos', ...Array.from(new Set(allCompartments))];
  }, [selectedRegion]);

  // Filter Logic
  const filteredMuscles = useMemo(() => {
    // In relations or quiz view, we always want all muscles available to the component
    if (viewMode === 'relations' || viewMode === 'quiz') return ANATOMY_DATA;

    return ANATOMY_DATA.filter(muscle => {
      const matchRegion = selectedRegion === 'Todos' || muscle.region === selectedRegion;
      const matchCompartment = selectedCompartment === 'Todos' || muscle.compartment === selectedCompartment;
      
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = 
        muscle.name.toLowerCase().includes(searchLower) ||
        muscle.action.toLowerCase().includes(searchLower) ||
        muscle.origin.toLowerCase().includes(searchLower) ||
        muscle.insertion.toLowerCase().includes(searchLower) ||
        muscle.innervation.toLowerCase().includes(searchLower) ||
        muscle.vascularization.toLowerCase().includes(searchLower) ||
        muscle.veins.toLowerCase().includes(searchLower);

      return matchRegion && matchCompartment && matchSearch;
    });
  }, [selectedRegion, selectedCompartment, searchQuery, viewMode]);

  // Handlers
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCompartment('Todos'); // Reset compartment when region changes
  };

  const handleReset = () => {
    setSelectedRegion('Todos');
    setSelectedCompartment('Todos');
    setSearchQuery('');
  };

  // Alteração aqui: Adicionado || viewMode === 'schematic'
  const isFilterAreaVisible = viewMode === 'cards' || viewMode === 'table' || viewMode === 'schematic';

  const NavTab = ({ mode, label, icon: Icon, isSpecial = false }: { mode: ViewMode, label: string, icon: any, isSpecial?: boolean }) => {
    const isActive = viewMode === mode;
    
    let tabClasses = '';
    let iconClasses = '';

    if (isSpecial) {
      // Botão especial: verde claro (inativo) e verde vibrante (ativo).
      tabClasses = isActive 
        ? 'bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300/50' // Ativo
        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'; // Inativo
      iconClasses = isActive ? 'text-white' : 'text-emerald-600';
    } else {
      // Botões normais
      tabClasses = isActive
        ? 'bg-white text-medical-700 shadow-sm ring-1 ring-slate-200' // Ativo
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'; // Inativo
      iconClasses = isActive ? 'text-medical-600' : 'text-slate-400';
    }

    return (
      <button
        onClick={() => setViewMode(mode)}
        className={`
          flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
          ${tabClasses}
          ${isSpecial ? 'font-bold uppercase tracking-wider' : ''}
        `}
      >
        <Icon className={`w-4 h-4 ${iconClasses}`} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Moderno */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Logo & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            {/* Logo Area */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleReset}>
              <div className="bg-medical-600 p-2.5 rounded-xl shadow-md group-hover:bg-medical-700 transition-colors">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">AnatoView <span className="text-medical-600">Pro</span></h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Atlas Muscular Interativo</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-medical-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar músculo, ação, nervo..."
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 sm:text-sm transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4 bg-slate-200 rounded-full p-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation & Filters Bar */}
          <div className="pb-3 pt-1 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            
            {/* Main Navigation Tabs */}
            <div className="bg-slate-100/80 p-1 rounded-xl flex overflow-x-auto hide-scrollbar sm:overflow-visible">
              <NavTab mode="cards" label="Cards" icon={Grid} />
              <NavTab mode="table" label="Tabela" icon={List} />
              <NavTab mode="schematic" label="Esquema" icon={Network} />
              <NavTab mode="relations" label="Relações" icon={GitMerge} />
              <NavTab mode="quiz" label="Questões de Prova" icon={BrainCircuit} isSpecial />
            </div>

            {/* Filters Area */}
            <div className={`
                flex flex-wrap items-center gap-3 transition-all duration-300
                ${isFilterAreaVisible ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}
            `}>
              <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                <Filter className="w-3 h-3 mr-1.5" />
                Filtrar
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-4 pr-10 py-2 text-sm font-medium border border-slate-200 rounded-lg shadow-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 cursor-pointer text-slate-700 min-w-[140px]"
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-4 pr-10 py-2 text-sm font-medium border border-slate-200 rounded-lg shadow-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 cursor-pointer text-slate-700 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedCompartment}
                  onChange={(e) => setSelectedCompartment(e.target.value)}
                  disabled={selectedRegion === 'Todos'}
                >
                  {compartments.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button 
                onClick={handleReset} 
                className="text-xs font-semibold text-slate-500 hover:text-medical-600 transition-colors flex items-center gap-1 pl-2"
              >
                <X className="w-3 h-3" />
                Limpar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'quiz' ? (
          <QuizView />
        ) : filteredMuscles.length > 0 ? (
          <>
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {filteredMuscles.map(muscle => (
                  <MuscleCard key={muscle.id} muscle={muscle} />
                ))}
              </div>
            )}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-fade-in">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Músculo</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ação Principal</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Inervação</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Detalhes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredMuscles.map(muscle => (
                          <tr key={muscle.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-slate-900">{muscle.name}</div>
                              <div className="text-xs text-slate-500">{muscle.region} • {muscle.compartment === 'Planta' ? 'Visão de plantar para dorsal' : muscle.compartment}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 max-w-xs">{muscle.action}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{muscle.innervation}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <MuscleCard 
                                 muscle={muscle} 
                                 customTrigger={
                                   <div className="text-medical-600 hover:text-medical-800 font-bold cursor-pointer">Ver Mais</div>
                                 }
                               />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}
            {viewMode === 'schematic' && <SchematicView muscles={filteredMuscles} />}
            {viewMode === 'relations' && <RelationsView muscles={ANATOMY_DATA} />}
          </>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-slate-100 inline-block p-6 rounded-full">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-800">Nenhum resultado encontrado</h3>
            <p className="mt-1 text-slate-500">Tente ajustar seus filtros ou o termo de busca.</p>
            <button 
              onClick={handleReset} 
              className="mt-6 bg-medical-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-medical-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </main>

       {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
              <p>Feito com <HeartHandshake className="w-4 h-4 inline-block text-rose-500 -mt-1" /> para estudantes de anatomia.</p>
              <p className="font-semibold mt-2">Desenvolvido por Pedro Amorim</p>
              <p className="text-xs mt-2">&copy; {new Date().getFullYear()} AnatoView Pro. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
};

export default App;