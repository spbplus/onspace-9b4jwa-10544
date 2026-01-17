import { GameState, EntityType, SectorPosition } from '@/types/game';
import { updateShipCondition, populateQuadrant } from './gameEngine';
import { Translations } from '@/constants/localization';

export interface NavigationResult {
  messages: string[];
  moved: boolean;
  timeUsed: number;
}

export function moveShip(state: GameState, course: number, warp: number, t: Translations): NavigationResult {
  const messages: string[] = [];
  
  if (state.ship.systems.warpEngines > 0 && warp > 0.2) {
    messages.push(t.messages.warpEnginesDamaged(0.2));
    warp = 0.2;
  }
  
  if (course < 1 || course > 9) {
    messages.push(t.messages.courseMustBe);
    return { messages, moved: false, timeUsed: 0 };
  }
  
  if (warp <= 0 || warp > 8) {
    messages.push(t.messages.warpFactorMustBe);
    return { messages, moved: false, timeUsed: 0 };
  }
  
  const energy = Math.floor(warp * 8);
  
  if (energy > state.ship.energy) {
    messages.push(`${t.messages.insufficientEnergy}: ${state.ship.energy}`);
    return { messages, moved: false, timeUsed: 0 };
  }
  
  // Calculate movement
  // Course mapping: 1=SE, 2=E, 3=NE, 4=S, 5=STOP, 6=N, 7=SW, 8=W, 9=NW
  
  // Course 5 = stop in place (no movement)
  if (Math.floor(course) === 5) {
    const energy = Math.floor(warp * 8);
    messages.push(t.messages.stoppedInPlace || 'Stopped in place.');
    return { messages, moved: false, timeUsed: 0 };
  }
  
  // Direct course to direction mapping (X increases right, Y increases down)
  const courseDirections: Record<number, { dx: number, dy: number }> = {
    1: { dx: -1, dy: 1 },  // SW (юго-запад)
    2: { dx: 0, dy: 1 },   // S (юг)
    3: { dx: 1, dy: 1 },   // SE (юго-восток)
    4: { dx: -1, dy: 0 },  // W (запад)
    6: { dx: 1, dy: 0 },   // E (восток)
    7: { dx: -1, dy: -1 }, // NW (северо-запад)
    8: { dx: 0, dy: -1 },  // N (север)
    9: { dx: 1, dy: -1 },  // NE (северо-восток)
  };
  
  const direction = courseDirections[Math.floor(course)];
  if (!direction) {
    messages.push(t.messages.courseMustBe);
    return { messages, moved: false, timeUsed: 0 };
  }
  
  const distance = warp;
  const dx = direction.dx * distance;
  const dy = direction.dy * distance;
  
  const currentQuadrant = state.ship.position.quadrant;
  const currentSector = state.ship.position.sector;
  const quadrant = state.galaxy[currentQuadrant.x][currentQuadrant.y];
  
  // Calculate new position
  let newQuadX = currentQuadrant.x;
  let newQuadY = currentQuadrant.y;
  let newSecX = currentSector.x + dx;
  let newSecY = currentSector.y + dy;
  
  // Handle quadrant transitions
  while (newSecX < 0) {
    newSecX += 8;
    newQuadX--;
  }
  while (newSecX >= 8) {
    newSecX -= 8;
    newQuadX++;
  }
  while (newSecY < 0) {
    newSecY += 8;
    newQuadY--;
  }
  while (newSecY >= 8) {
    newSecY -= 8;
    newQuadY++;
  }
  
  // Check galaxy bounds
  if (newQuadX < 0 || newQuadX >= 8 || newQuadY < 0 || newQuadY >= 8) {
    messages.push(t.messages.cannotLeaveGalaxy);
    return { messages, moved: false, timeUsed: 0 };
  }
  
  const newSectorPos: SectorPosition = {
    x: Math.floor(newSecX),
    y: Math.floor(newSecY),
  };
  
  // Check for collisions in current quadrant
  if (newQuadX === currentQuadrant.x && newQuadY === currentQuadrant.y) {
    const target = quadrant.sectors[newSectorPos.x][newSectorPos.y];
    
    if (target && target !== EntityType.ENTERPRISE) {
      messages.push(t.messages.collision(newSectorPos.x, newSectorPos.y));
      messages.push(t.messages.emergencyStop);
      state.ship.energy -= Math.floor(energy * 0.5);
      return { messages, moved: false, timeUsed: 1 };
    }
  }
  
  // Execute move
  state.ship.energy -= energy;
  
  // Clear old position
  quadrant.sectors[currentSector.x][currentSector.y] = null;
  
  // Update position
  const changedQuadrant = newQuadX !== currentQuadrant.x || newQuadY !== currentQuadrant.y;
  
  state.ship.position.quadrant.x = newQuadX;
  state.ship.position.quadrant.y = newQuadY;
  state.ship.position.sector = newSectorPos;
  
  const timeUsed = 1;
  state.timeRemaining -= timeUsed;
  state.stardate += timeUsed;
  
  if (changedQuadrant) {
    messages.push(t.messages.enteringQuadrant(newQuadX, newQuadY));
    populateQuadrant(state);
  } else {
    const newQuadrant = state.galaxy[newQuadX][newQuadY];
    newQuadrant.sectors[newSectorPos.x][newSectorPos.y] = EntityType.ENTERPRISE;
    updateShipCondition(state);
  }
  
  return { messages, moved: true, timeUsed };
}

export function dockAtStarbase(state: GameState, t: Translations): string[] {
  const messages: string[] = [];
  
  if (state.ship.condition !== 'DOCKED') {
    messages.push(t.messages.notDockedAtStarbase);
    return messages;
  }
  
  messages.push(t.messages.dockedAtStarbase);
  messages.push(t.messages.replenishingSupplies);
  
  state.ship.energy = 3000;
  state.ship.torpedoes = 10;
  state.ship.shields = 0;
  
  // Repair all systems
  const systems = Object.keys(state.ship.systems) as (keyof typeof state.ship.systems)[];
  for (const system of systems) {
    state.ship.systems[system] = 0;
  }
  
  messages.push(`${t.status.energy}: 3000`);
  messages.push(`${t.status.torpedoes}: 10`);
  messages.push(t.messages.allSystemsRepaired);
  
  return messages;
}
