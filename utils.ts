export type LensType = 'innervation' | 'action' | 'origin' | 'insertion' | 'vascularization' | 'veins';

export const normalizeTerm = (text: string, type: LensType): string => {
  const lower = text.toLowerCase();
  const trimmed = text.trim();

  // Helper to capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
    if (lower.includes('femoral') && !lower.includes('quadrado')) return 'Nervo Femoral';
    if (lower.includes('obturador')) return 'Nervo Obturatório';
    if (lower.includes('glúteo superior')) return 'Nervo Glúteo Superior';
    if (lower.includes('glúteo inferior')) return 'Nervo Glúteo Inferior';
    if (lower.includes('tibial')) return 'Nervo Tibial';
    if (lower.includes('fibular comum')) return 'Nervo Fibular Comum';
    if (lower.includes('fibular profundo')) return 'Nervo Fibular Profundo';
    if (lower.includes('fibular superficial')) return 'Nervo Fibular Superficial';
    if (lower.includes('plantar medial')) return 'Nervo Plantar Medial';
    if (lower.includes('plantar lateral')) return 'Nervo Plantar Lateral';
    if (lower.includes('isquiático') || lower.includes('ciático')) return 'Nervo Isquiático';
    if (lower.includes('quadrado femoral')) return 'Nervo do Quadrado Femoral';
    if (lower.includes('ramos ventrais')) return 'Ramos Ventrais (Sacral)';
    return trimmed; // Retorna o termo original
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
    
    // Inervação -> AMARELO (Amber)
    if (t.includes('nervo') || t.includes('inervação')) {
        return { 
            solid: 'bg-amber-500', 
            soft: 'bg-amber-50', 
            border: 'border-amber-200',
            text: 'text-amber-700',
            ring: 'focus:ring-amber-500'
        };
    }

    // Vascularização (Artérias) -> VIOLETA/ROXO (Violet)
    if (t.includes('artéria') || t.includes('vascularização')) {
        return { 
            solid: 'bg-violet-500', 
            soft: 'bg-violet-50', 
            border: 'border-violet-200',
            text: 'text-violet-700',
            ring: 'focus:ring-violet-500'
        };
    }

    // Veias -> CIANO (Cyan)
    if (t.includes('veia') || t.includes('drenagem') || t.includes('venoso')) {
        return { 
            solid: 'bg-cyan-500', 
            soft: 'bg-cyan-50', 
            border: 'border-cyan-200',
            text: 'text-cyan-700',
            ring: 'focus:ring-cyan-500'
        };
    }

    // Origem -> VERMELHO (Red)
    if (t.includes('origem')) {
        return { 
            solid: 'bg-red-500', 
            soft: 'bg-red-50', 
            border: 'border-red-200',
            text: 'text-red-700',
            ring: 'focus:ring-red-500'
        };
    }

    // Inserção -> AZUL (Blue)
    if (t.includes('inserção')) {
        return { 
            solid: 'bg-blue-500', 
            soft: 'bg-blue-50', 
            border: 'border-blue-200',
            text: 'text-blue-700',
            ring: 'focus:ring-blue-500'
        };
    }

    // Ação -> VERDE (Emerald)
    if (t.includes('ação') || t.includes('flexão') || t.includes('extensão') || t.includes('adução') || t.includes('abdução')) {
        return { 
            solid: 'bg-emerald-500', 
            soft: 'bg-emerald-50', 
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            ring: 'focus:ring-emerald-500'
        };
    }

    // Fallbacks
    if (t.includes('femoral') || t.includes('extensão') || t.includes('fêmur') || t.includes('quadril')) {
        return { solid: 'bg-blue-500', soft: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'focus:ring-blue-500' };
    }
    if (t.includes('obturador') || t.includes('adução') || t.includes('medial')) {
        return { solid: 'bg-emerald-500', soft: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'focus:ring-emerald-500' };
    }
    if (t.includes('tibial') || t.includes('flexão') || t.includes('posterior')) {
        return { solid: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'focus:ring-amber-500' };
    }
    if (t.includes('fibular') || t.includes('eversão') || t.includes('lateral')) {
        return { solid: 'bg-rose-500', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', ring: 'focus:ring-rose-500' };
    }
    
    // Default Gray
    return { 
        solid: 'bg-slate-500', 
        soft: 'bg-slate-50', 
        border: 'border-slate-200',
        text: 'text-slate-700',
        ring: 'focus:ring-slate-500'
    };
};