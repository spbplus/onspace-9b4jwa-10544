import { GameState, Klingon, SectorPosition, EntityType } from '@/types/game';
import { calculateDistance, damageSystem, updateShipCondition } from './gameEngine';
import { Translations } from '@/constants/localization';

export interface CombatResult {
  messages: string[];
  klingonDestroyed?: boolean;
  shipHit?: boolean;
  damage?: number;
}

export function firePhasers(state: GameState, energy: number, t: Translations): CombatResult {
  const messages: string[] = [];
  
  if (state.ship.systems.phaserControl > 0) {
    messages.push(t.messages.phaserControlDamaged);
    return { messages };
  }
  
  if (energy <= 0) {
    messages.push(t.messages.amountMustBePositive);
    return { messages };
  }
  
  if (energy > state.ship.energy) {
    messages.push(`${t.messages.insufficientEnergy}: ${state.ship.energy}`);
    return { messages };
  }
  
  if (state.currentKlingons.length === 0) {
    messages.push(t.messages.phasersLocked);
    return { messages };
  }
  
  state.ship.energy -= energy;
  
  const energyPerKlingon = energy / state.currentKlingons.length;
  let anyDestroyed = false;
  
  for (let i = state.currentKlingons.length - 1; i >= 0; i--) {
    const klingon = state.currentKlingons[i];
    const distance = calculateDistance(state.ship.position.sector, klingon.position);
    const hitStrength = Math.floor(energyPerKlingon / distance * (2 + Math.random()));
    
    klingon.shields -= hitStrength;
    
    messages.push(t.messages.klingonHit(klingon.position.x, klingon.position.y, hitStrength, Math.floor(klingon.shields)));
    
    if (klingon.shields <= 0) {
      messages.push(t.messages.klingonDestroyed(klingon.position.x, klingon.position.y));
      destroyKlingon(state, i);
      anyDestroyed = true;
    }
  }
  
  return { messages, klingonDestroyed: anyDestroyed };
}

export function fireTorpedo(state: GameState, course: number, t: Translations): CombatResult {
  const messages: string[] = [];
  
  if (state.ship.systems.photonTubes > 0) {
    messages.push(t.messages.photonTubesDamaged);
    return { messages };
  }
  
  if (state.ship.torpedoes <= 0) {
    messages.push(t.messages.noTorpedoes);
    return { messages };
  }
  
  if (course < 1 || course > 9) {
    messages.push(t.messages.courseMustBe);
    return { messages };
  }
  
  state.ship.torpedoes--;
  messages.push(t.messages.torpedoFired(course));
  
  const trajectory = calculateTrajectory(state.ship.position.sector, course);
  let hit = false;
  
  for (const pos of trajectory) {
    if (pos.x < 0 || pos.x >= 8 || pos.y < 0 || pos.y >= 8) {
      messages.push(t.messages.torpedoMissed);
      break;
    }
    
    const quadrant = state.galaxy[state.ship.position.quadrant.x][state.ship.position.quadrant.y];
    const target = quadrant.sectors[pos.x][pos.y];
    
    messages.push(`  [${pos.x},${pos.y}]`);
    
    if (target === EntityType.STAR) {
      messages.push(`[${pos.x},${pos.y}] *`);
      break;
    }
    
    if (target === EntityType.KLINGON) {
      const klingonIndex = state.currentKlingons.findIndex(
        k => k.position.x === pos.x && k.position.y === pos.y
      );
      if (klingonIndex >= 0) {
        messages.push(t.messages.klingonDestroyed(pos.x, pos.y));
        destroyKlingon(state, klingonIndex);
      }
      hit = true;
      break;
    }
    
    if (target === EntityType.STARBASE) {
      messages.push(`[${pos.x},${pos.y}] B`);
      quadrant.sectors[pos.x][pos.y] = null;
      quadrant.starbases--;
      break;
    }
  }
  
  if (!hit && trajectory.length > 0) {
    const last = trajectory[trajectory.length - 1];
    if (last.x >= 0 && last.x < 8 && last.y >= 0 && last.y < 8) {
      messages.push(t.messages.torpedoMissed);
    }
  }
  
  return { messages, klingonDestroyed: hit };
}

function calculateTrajectory(start: SectorPosition, course: number): SectorPosition[] {
  const positions: SectorPosition[] = [];
  
  // Direct course to direction mapping (X increases right, Y increases down)
  const courseDirections: Record<number, { dx: number, dy: number }> = {
    1: { dx: -1, dy: 1 },  // SW (юго-запад)
    2: { dx: 0, dy: 1 },   // S (юг)
    3: { dx: 1, dy: 1 },   // SE (юго-восток)
    4: { dx: -1, dy: 0 },  // W (запад)
    5: { dx: 0, dy: 0 },   // STOP (на месте)
    6: { dx: 1, dy: 0 },   // E (восток)
    7: { dx: -1, dy: -1 }, // NW (северо-запад)
    8: { dx: 0, dy: -1 },  // N (север)
    9: { dx: 1, dy: -1 },  // NE (северо-восток)
  };
  
  const direction = courseDirections[Math.floor(course)] || { dx: 0, dy: -1 };
  const dx = direction.dx;
  const dy = direction.dy;
  
  let x = start.x;
  let y = start.y;
  
  for (let i = 0; i < 10; i++) {
    x += dx;
    y += dy;
    
    const pos = {
      x: Math.floor(x),
      y: Math.floor(y),
    };
    
    if (pos.x < 0 || pos.x >= 8 || pos.y < 0 || pos.y >= 8) {
      break;
    }
    
    positions.push(pos);
  }
  
  return positions;
}

function destroyKlingon(state: GameState, index: number): void {
  const klingon = state.currentKlingons[index];
  const quadrant = state.galaxy[state.ship.position.quadrant.x][state.ship.position.quadrant.y];
  
  quadrant.sectors[klingon.position.x][klingon.position.y] = null;
  state.currentKlingons.splice(index, 1);
  quadrant.klingons--;
  state.klingonsRemaining--;
  
  updateShipCondition(state);
  
  if (state.klingonsRemaining === 0) {
    state.won = true;
  }
}

export function klingonAttack(state: GameState, t: Translations): CombatResult {
  const messages: string[] = [];
  
  if (state.currentKlingons.length === 0) {
    return { messages };
  }
  
  if (state.ship.condition === 'DOCKED') {
    return { messages };
  }
  
  messages.push('');
  
  let totalDamage = 0;
  
  for (const klingon of state.currentKlingons) {
    const distance = calculateDistance(state.ship.position.sector, klingon.position);
    const hitStrength = Math.floor((klingon.shields / distance) * (2 + Math.random()));
    
    totalDamage += hitStrength;
    
    messages.push(t.messages.klingonFires(klingon.position.x, klingon.position.y));
  }
  
  if (state.ship.shieldsUp && state.ship.shields > 0) {
    const shieldAbsorbed = Math.min(totalDamage, state.ship.shields);
    state.ship.shields -= shieldAbsorbed;
    totalDamage -= shieldAbsorbed;
    
    messages.push(t.messages.shieldsAbsorbed(shieldAbsorbed, state.ship.shields));
    
    if (state.ship.shields === 0) {
      messages.push(t.messages.shieldsDown);
    }
  }
  
  if (totalDamage > 0) {
    state.ship.energy -= totalDamage;
    messages.push(t.messages.hitOnEnterprise(totalDamage));
    
    if (state.ship.energy <= 0) {
      state.destroyed = true;
      messages.push('');
      messages.push(t.messages.enterpriseDestroyed);
    }
  }
  
  return { messages, shipHit: totalDamage > 0, damage: totalDamage };
}
