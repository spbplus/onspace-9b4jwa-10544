import {
  GameState,
  Quadrant,
  Ship,
  ShipSystems,
  EntityType,
  Klingon,
  QuadrantPosition,
  SectorPosition,
} from '@/types/game';

const GALAXY_SIZE = 8;
const QUADRANT_SIZE = 8;
const INITIAL_ENERGY = 3000;
const INITIAL_TORPEDOES = 10;
const INITIAL_SHIELDS = 0;
const TIME_LIMIT = 30;

export function createNewGame(): GameState {
  const galaxy = initializeGalaxy();
  const initialKlingons = countTotalKlingons(galaxy);
  const ship = createShip(galaxy);
  
  return {
    ship,
    galaxy,
    klingonsRemaining: initialKlingons,
    initialKlingons,
    stardate: 2000 + Math.floor(Math.random() * 100),
    initialStardate: 2000,
    timeRemaining: TIME_LIMIT,
    destroyed: false,
    won: false,
    currentKlingons: [],
  };
}

function initializeGalaxy(): Quadrant[][] {
  const galaxy: Quadrant[][] = [];
  let totalKlingons = 0;
  const targetKlingons = 15 + Math.floor(Math.random() * 10); // 15-24 Klingons

  for (let x = 0; x < GALAXY_SIZE; x++) {
    galaxy[x] = [];
    for (let y = 0; y < GALAXY_SIZE; y++) {
      const klingons = totalKlingons < targetKlingons && Math.random() < 0.3
        ? Math.floor(Math.random() * 3) + 1
        : 0;
      totalKlingons += klingons;

      galaxy[x][y] = {
        position: { x, y },
        klingons,
        starbases: Math.random() < 0.1 ? 1 : 0,
        stars: Math.floor(Math.random() * 8) + 1,
        visited: false,
        sectors: createEmptySectors(),
      };
    }
  }

  return galaxy;
}

function createEmptySectors(): (EntityType | null)[][] {
  const sectors: (EntityType | null)[][] = [];
  for (let x = 0; x < QUADRANT_SIZE; x++) {
    sectors[x] = [];
    for (let y = 0; y < QUADRANT_SIZE; y++) {
      sectors[x][y] = null;
    }
  }
  return sectors;
}

function createShip(galaxy: Quadrant[][]): Ship {
  // Find a safe starting quadrant
  let quadrant: Quadrant;
  let qx: number, qy: number;
  
  do {
    qx = Math.floor(Math.random() * GALAXY_SIZE);
    qy = Math.floor(Math.random() * GALAXY_SIZE);
    quadrant = galaxy[qx][qy];
  } while (quadrant.klingons > 0);

  const sx = Math.floor(Math.random() * QUADRANT_SIZE);
  const sy = Math.floor(Math.random() * QUADRANT_SIZE);

  return {
    position: {
      quadrant: { x: qx, y: qy },
      sector: { x: sx, y: sy },
    },
    energy: INITIAL_ENERGY,
    torpedoes: INITIAL_TORPEDOES,
    shields: INITIAL_SHIELDS,
    shieldsUp: false,
    systems: createSystems(),
    condition: 'GREEN',
  };
}

function createSystems(): ShipSystems {
  return {
    warpEngines: 0,
    shortRangeSensors: 0,
    longRangeSensors: 0,
    phaserControl: 0,
    photonTubes: 0,
    damageControl: 0,
    shields: 0,
    computer: 0,
  };
}

function countTotalKlingons(galaxy: Quadrant[][]): number {
  let total = 0;
  for (let x = 0; x < GALAXY_SIZE; x++) {
    for (let y = 0; y < GALAXY_SIZE; y++) {
      total += galaxy[x][y].klingons;
    }
  }
  return total;
}

export function populateQuadrant(state: GameState): void {
  const { quadrant, sector } = state.ship.position;
  const q = state.galaxy[quadrant.x][quadrant.y];
  
  // Clear sectors
  q.sectors = createEmptySectors();
  
  // Place Enterprise
  q.sectors[sector.x][sector.y] = EntityType.ENTERPRISE;
  
  // Place Klingons
  state.currentKlingons = [];
  for (let i = 0; i < q.klingons; i++) {
    const pos = findEmptyPosition(q.sectors);
    if (pos) {
      q.sectors[pos.x][pos.y] = EntityType.KLINGON;
      state.currentKlingons.push({
        type: EntityType.KLINGON,
        position: pos,
        shields: 200 + Math.floor(Math.random() * 100),
      });
    }
  }
  
  // Place Starbases
  for (let i = 0; i < q.starbases; i++) {
    const pos = findEmptyPosition(q.sectors);
    if (pos) {
      q.sectors[pos.x][pos.y] = EntityType.STARBASE;
    }
  }
  
  // Place Stars
  for (let i = 0; i < q.stars; i++) {
    const pos = findEmptyPosition(q.sectors);
    if (pos) {
      q.sectors[pos.x][pos.y] = EntityType.STAR;
    }
  }
  
  q.visited = true;
  updateShipCondition(state);
}

function findEmptyPosition(sectors: (EntityType | null)[][]): SectorPosition | null {
  const empty: SectorPosition[] = [];
  
  for (let x = 0; x < QUADRANT_SIZE; x++) {
    for (let y = 0; y < QUADRANT_SIZE; y++) {
      if (!sectors[x][y]) {
        empty.push({ x, y });
      }
    }
  }
  
  return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : null;
}

export function updateShipCondition(state: GameState): void {
  const q = state.galaxy[state.ship.position.quadrant.x][state.ship.position.quadrant.y];
  
  // Check if docked
  const sector = state.ship.position.sector;
  const adjacent = [
    { x: sector.x - 1, y: sector.y },
    { x: sector.x + 1, y: sector.y },
    { x: sector.x, y: sector.y - 1 },
    { x: sector.x, y: sector.y + 1 },
    { x: sector.x - 1, y: sector.y - 1 },
    { x: sector.x + 1, y: sector.y + 1 },
    { x: sector.x - 1, y: sector.y + 1 },
    { x: sector.x + 1, y: sector.y - 1 },
  ];
  
  let docked = false;
  for (const pos of adjacent) {
    if (pos.x >= 0 && pos.x < QUADRANT_SIZE && pos.y >= 0 && pos.y < QUADRANT_SIZE) {
      if (q.sectors[pos.x][pos.y] === EntityType.STARBASE) {
        docked = true;
        break;
      }
    }
  }
  
  if (docked) {
    state.ship.condition = 'DOCKED';
  } else if (q.klingons > 0) {
    state.ship.condition = state.ship.energy < 500 ? 'RED' : 'YELLOW';
  } else {
    state.ship.condition = 'GREEN';
  }
}

export function calculateDistance(from: SectorPosition, to: SectorPosition): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateDirection(from: SectorPosition, to: SectorPosition): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  if (dx === 0 && dy === 0) return 0;
  
  let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
  angle = 90 - angle;
  if (angle < 0) angle += 360;
  
  // Convert to course (1-9 system)
  const course = ((angle / 45) % 8) + 1;
  return Math.round(course * 10) / 10;
}

export function damageSystem(state: GameState): void {
  const systems = Object.keys(state.ship.systems) as (keyof ShipSystems)[];
  const system = systems[Math.floor(Math.random() * systems.length)];
  const damage = Math.random() * 5;
  
  state.ship.systems[system] = Math.max(0, state.ship.systems[system] + damage);
}

export function repairSystems(state: GameState, amount: number): void {
  const systems = Object.keys(state.ship.systems) as (keyof ShipSystems)[];
  
  for (const system of systems) {
    if (state.ship.systems[system] > 0) {
      state.ship.systems[system] = Math.max(0, state.ship.systems[system] - amount);
    }
  }
}
