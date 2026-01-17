export interface Position {
  x: number;
  y: number;
}

export interface QuadrantPosition extends Position {}
export interface SectorPosition extends Position {}

export enum EntityType {
  EMPTY = ' ',
  ENTERPRISE = 'E',
  KLINGON = 'K',
  STARBASE = 'B',
  STAR = '*',
}

export interface Entity {
  type: EntityType;
  position: SectorPosition;
  shields?: number;
  energy?: number;
}

export interface Klingon extends Entity {
  type: EntityType.KLINGON;
  shields: number;
}

export interface Quadrant {
  position: QuadrantPosition;
  klingons: number;
  starbases: number;
  stars: number;
  visited: boolean;
  sectors: (EntityType | null)[][];
}

export interface ShipSystems {
  warpEngines: number;
  shortRangeSensors: number;
  longRangeSensors: number;
  phaserControl: number;
  photonTubes: number;
  damageControl: number;
  shields: number;
  computer: number;
}

export interface Ship {
  position: {
    quadrant: QuadrantPosition;
    sector: SectorPosition;
  };
  energy: number;
  torpedoes: number;
  shields: number;
  shieldsUp: boolean;
  systems: ShipSystems;
  condition: 'GREEN' | 'YELLOW' | 'RED' | 'DOCKED';
}

export interface GameState {
  ship: Ship;
  galaxy: Quadrant[][];
  klingonsRemaining: number;
  initialKlingons: number;
  stardate: number;
  initialStardate: number;
  timeRemaining: number;
  destroyed: boolean;
  won: boolean;
  currentKlingons: Klingon[];
}

export interface Command {
  name: string;
  shortcut: string;
  description: string;
  handler: (args: string[]) => void;
}

export interface LogEntry {
  text: string;
  type: 'normal' | 'error' | 'warning' | 'info' | 'success';
  timestamp: number;
}
