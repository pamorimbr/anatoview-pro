export type LensType = 'innervation' | 'action' | 'origin' | 'insertion' | 'vascularization' | 'veins' | 'muscles';

export const getKeywordForLens = (lens: LensType): string => {
  switch (lens) {
    case 'muscles': return 'músculos';
    case 'innervation': return 'inervação';
    case 'vascularization': return 'artéria';
    case 'veins': return 'veia';
    case 'action': return 'ação';
    case 'origin': return 'origem';
    case 'insertion': return 'inserção';
    default: return '';
  }
};

export const normalizeTerm = (text: string, type: LensType): string => {
  const lower = text.toLowerCase();
  const trimmed = text.trim();

  if (type === 'veins') {
    if (lower.includes('safena magna')) return 'Veia Safena Magna';
    if (lower.includes('safena parva')) return 'Veia Safena Parva';
    if (lower.includes('femoral') && !lower.includes('profunda')) return 'Veia Femoral';
    if (lower.includes('femoral profunda')) return 'Veia Femoral Profunda';
    if (lower.includes('glútea superior')) return 'Veia Glútea Superior';
    if (lower.includes('glútea inferior')) return 'Veia Glútea Inferior';
    if (lower.includes('obturatória')) return 'Veia Obturatória';
    if (lower.includes('pudenda')) return 'Veia Pudenda Interna';
    if (lower.includes('poplítea')) return 'Veia Poplítea';
    if (lower.includes('tibial anterior')) return 'Veias Tibiais Anteriores';
    if (lower.includes('tibial posterior')) return 'Veias Tibiais Posteriores';
    if (lower.includes('fibular')) return 'Veias Fibulares';
    if (lower.includes('plantar medial')) return 'Veias Plantares Mediais';
    if (lower.includes('plantar lateral')) return 'Veias Plantares Laterais';
    if (lower.includes('dorsal')) return 'Arco Venoso Dorsal';
    if (lower.includes('sural') || lower.includes('surais')) return 'Veias Surais';
    return trimmed; // Retorna o termo original se não houver grupo específico
  }

  if (type === 'vascularization') {
    if (lower.includes('glútea superior')) return 'Artéria Glútea Superior';
    if (lower.includes('glútea inferior')) return 'Artéria Glútea Inferior';
    if (lower.includes('femoral') && !lower.includes('profunda')) return 'Artéria Femoral';
    if (lower.includes('femoral profunda') || lower.includes('circunflexa')) return 'Artéria Femoral Profunda';
    if (lower.includes('obturatória') || lower.includes('obturadora')) return 'Artéria Obturatória';
    if (lower.includes('pudenda')) return 'Artéria Pudenda Interna';
    if (lower.includes('poplítea')) return 'Artéria Poplítea';
    if (lower.includes('tibial anterior')) return 'Artéria Tibial Anterior';
    if (lower.includes('tibial posterior')) return 'Artéria Tibial Posterior';
    if (lower.includes('fibular')) return 'Artéria Fibular';
    if (lower.includes('plantar medial')) return 'Artéria Plantar Medial';
    if (lower.includes('plantar lateral') || lower.includes('arco plantar')) return 'Artéria Plantar Lateral';
    if (lower.includes('dorsal do pé') || lower.includes('tarsal')) return 'Artéria Dorsal do Pé';
    return trimmed; // Retorna o termo original para evitar "Outros"
  }

  if (type === 'innervation') {
    // Normaliza removendo as raízes para agrupamento (e.g., L2-L4)
    const normalizedText = trimmed.replace(/\s*\([^)]*\)/g, '');
    const lowerNormalized = normalizedText.toLowerCase();

    // --- GRUPO 1: Ramos musculares específicos (devem ser checados primeiro para evitar conflitos) ---
    if (lowerNormalized.includes('quad. femoral') || lowerNormalized.includes('quadrado femoral')) return 'N. para o Quad. Femoral';
    if (lowerNormalized.includes('obt. interno') || lowerNormalized.includes('obturador interno')) return 'N. para o Obt. Interno';
    if (lowerNormalized.includes('piriforme')) return 'N. para o m. Piriforme';
    
    // --- GRUPO 2: Troncos principais com nomes que podem ser substrings de outros (requerem lógica cuidadosa) ---
    // N. Femoral: Usa correspondência exata para não capturar "N. do Quadrado Femoral".
    if (lowerNormalized === 'n. femoral') return 'N. Femoral';
    
    // N. Obturador: Checado após os ramos específicos para evitar conflito com "N. para o Obturador Interno".
    if (lowerNormalized.includes('obturatório') || lowerNormalized.includes('obturador')) return 'N. Obturador';

    // --- GRUPO 3: Outros nervos principais (menos ambíguos) ---
    if (lowerNormalized.includes('glúteo superior')) return 'N. Glúteo Superior';
    if (lowerNormalized.includes('glúteo inferior')) return 'N. Glúteo Inferior';
    if (lowerNormalized.includes('tibial')) return 'N. Tibial';
    if (lowerNormalized.includes('fibular profundo')) return 'N. Fibular Profundo';
    if (lowerNormalized.includes('fibular superficial')) return 'N. Fibular Superficial';
    if (lowerNormalized.includes('fibular comum')) return 'N. Fibular Comum';
    if (lowerNormalized.includes('plantar medial')) return 'N. Plantar Medial';
    if (lowerNormalized.includes('plantar lateral')) return 'N. Plantar Lateral';
    if (lowerNormalized.includes('isquiático') || lowerNormalized.includes('ciático')) return 'N. Isquiático';
    
    // --- GRUPO 4: Ramos de raízes ---
    if (lowerNormalized.includes('ramos ventrais de l1-l3')) return 'Ramos Ventrais de L1-L3';
    if (lowerNormalized.includes('ramos ventrais de l5-s2')) return 'Ramos Ventrais de L5-S2';
    
    // Fallback: Retorna o texto original (normalizado) se não corresponder a nenhum grupo principal.
    return normalizedText;
  }

  if (type === 'action') {
    if (lower.includes('flexão') && lower.includes('quadril')) return 'Flexão do Quadril';
    if (lower.includes('extensão') && lower.includes('quadril')) return 'Extensão do Quadril';
    if (lower.includes('flexão') && lower.includes('joelho')) return 'Flexão do Joelho';
    if (lower.includes('extensão') && lower.includes('joelho')) return 'Extensão do Joelho';
    if (lower.includes('adução')) return 'Adução';
    if (lower.includes('abdução')) return 'Abdução';
    if (lower.includes('dorsiflexão')) return 'Dorsiflexão';
    if (lower.includes('flexão plantar')) return 'Flexão Plantar';
    if (lower.includes('eversão')) return 'Eversão';
    if (lower.includes('inversão')) return 'Inversão';
    if (lower.includes('rotação lateral')) return 'Rotação Lateral';
    if (lower.includes('rotação medial')) return 'Rotação Medial';
    if (lower.includes('flexão') && (lower.includes('dedos') || lower.includes('hálux'))) return 'Flexão dos Dedos/Hálux';
    if (lower.includes('extensão') && (lower.includes('dedos') || lower.includes('hálux'))) return 'Extensão dos Dedos/Hálux';
    return 'Ação Complexa/Outra';
  }

  if (type === 'origin' || type === 'insertion') {
    if (lower.includes('fêmur') || lower.includes('femoral') || lower.includes('trocânter') || lower.includes('áspera')) return 'Fêmur';
    if (lower.includes('tíbia') || lower.includes('tibial') || lower.includes('ganso')) return 'Tíbia';
    if (lower.includes('fíbula') || lower.includes('fibular')) return 'Fíbula';
    if (lower.includes('púbis') || lower.includes('pubis')) return 'Púbis';
    if (lower.includes('ísquio') || lower.includes('isquiático') || lower.includes('tuberosidade isquiática')) return 'Túber Isquiático';
    if (lower.includes('ílio') || lower.includes('ilíaca') || lower.includes('eias') || lower.includes('eiai')) return 'Ílio';
    if (lower.includes('sacro')) return 'Sacro';
    if (lower.includes('cóccix')) return 'Sacro/Cóccix';
    if (lower.includes('calcâneo') || lower.includes('aquiles')) return 'Calcâneo';
    if (lower.includes('falange')) return 'Falanges';
    if (lower.includes('metatarso')) return 'Metatarsos';
    return 'Outras Estruturas';
  }

  return text;
};


export const getColorTheme = (term: string) => {
    const t = term.toLowerCase();
    
    // Tema para Músculos (Novo)
    if (t.includes('músculo')) return { solid: 'bg-rose-600', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', ring: 'focus:ring-rose-600' };

    // Paleta de Cores Dedicada e Otimizada para Nervos (única e com alto contraste)
    // Rebalanceado para melhorar a distinção entre nervos adjacentes (ex: Fibulares)
    if (t.includes('isquiático') || t.includes('ciático')) return { solid: 'bg-slate-500', soft: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', ring: 'focus:ring-slate-500' }; // Tronco principal - neutro
    if (t.includes('tibial')) return { solid: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'focus:ring-amber-500' }; // Ramo principal - quente
    
    // Família Fibular (Cores frias e distintas)
    if (t.includes('fibular comum')) return { solid: 'bg-cyan-500', soft: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', ring: 'focus:ring-cyan-500' };
    if (t.includes('fibular profundo')) return { solid: 'bg-sky-500', soft: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', ring: 'focus:ring-sky-500' };
    if (t.includes('fibular superficial')) return { solid: 'bg-teal-500', soft: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', ring: 'focus:ring-teal-500' };
    
    // Plexo Lombar e Sacral
    if (t.includes('femoral') && !t.includes('quadrado')) return { solid: 'bg-lime-500', soft: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-700', ring: 'focus:ring-lime-500' };
    if (t.includes('obturatório') || t.includes('obturador')) return { solid: 'bg-purple-500', soft: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'focus:ring-purple-500' };
    if (t.includes('glúteo superior')) return { solid: 'bg-indigo-500', soft: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', ring: 'focus:ring-indigo-500' };
    if (t.includes('glúteo inferior')) return { solid: 'bg-fuchsia-500', soft: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700', ring: 'focus:ring-fuchsia-500' };
    
    // Nervos do Pé
    if (t.includes('plantar medial')) return { solid: 'bg-red-500', soft: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'focus:ring-red-500' }; // Cor contrastante com o Lateral
    if (t.includes('plantar lateral')) return { solid: 'bg-green-500', soft: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', ring: 'focus:ring-green-500' };

    // Nervos Menores / Ramos Musculares
    if (t.includes('quadrado femoral') || t.includes('obturador interno') || t.includes('quad. femoral') || t.includes('obt. interno') || t.includes('piriforme')) return { solid: 'bg-orange-500', soft: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'focus:ring-orange-500' };
    if (t.includes('ramos ventrais de l5-s2')) return { solid: 'bg-rose-500', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', ring: 'focus:ring-rose-500' };
    if (t.includes('ramos ventrais de l1-l3')) return { solid: 'bg-pink-500', soft: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', ring: 'focus:ring-pink-500' };

    // Cores por tipo (não-nervo)
    if (t.includes('inervação')) return { solid: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'focus:ring-amber-500' };
    if (t.includes('artéria') || t.includes('vascularização')) return { solid: 'bg-violet-500', soft: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', ring: 'focus:ring-violet-500' };
    if (t.includes('veia') || t.includes('drenagem') || t.includes('venoso')) return { solid: 'bg-cyan-500', soft: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', ring: 'focus:ring-cyan-500' };
    if (t.includes('origem')) return { solid: 'bg-red-500', soft: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'focus:ring-red-500' };
    if (t.includes('inserção')) return { solid: 'bg-blue-500', soft: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'focus:ring-blue-500' };
    if (t.includes('ação') || t.includes('flexão') || t.includes('extensão') || t.includes('adução') || t.includes('abdução')) return { solid: 'bg-emerald-500', soft: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'focus:ring-emerald-500' };
    
    // Default Gray
    return { 
        solid: 'bg-slate-500', 
        soft: 'bg-slate-50', 
        border: 'border-slate-200',
        text: 'text-slate-700',
        ring: 'focus:ring-slate-500'
    };
};