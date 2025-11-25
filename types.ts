export interface Muscle {
  id: string;
  region: string;
  compartment: string;
  subCompartment?: string; // For things like "Camada 1", "Profundo", etc.
  name: string;
  origin: string;
  insertion: string;
  innervation: string;
  vascularization: string;
  veins: string; // Drenagem Venosa
  action: string;
}

export type ViewMode = 'cards' | 'table' | 'schematic' | 'relations' | 'quiz';
