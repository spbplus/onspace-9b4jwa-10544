import { GameState, Quadrant, ShipSystems } from '@/types/game';
import { Translations } from '@/constants/localization';

export function generateShortRangeScan(state: GameState, t: Translations): string[] {
  const lines: string[] = [];
  const quadrant = state.galaxy[state.ship.position.quadrant.x][state.ship.position.quadrant.y];
  
  if (state.ship.systems.shortRangeSensors > 0) {
    lines.push(t.messages.shortRangeSensorsDamaged);
    return lines;
  }
  
  lines.push('  0 1 2 3 4 5 6 7');
  
  for (let y = 0; y < 8; y++) {
    let row = y + ' ';
    for (let x = 0; x < 8; x++) {
      const entity = quadrant.sectors[x][y];
      row += (entity || '.') + ' ';
    }
    lines.push(row);
  }
  
  // Add status below the map
  lines.push('');
  lines.push(`${t.status.stardate}: ${state.stardate.toFixed(1)}`);
  
  let condition = state.ship.condition;
  if (condition === 'GREEN') condition = t.conditions.green;
  else if (condition === 'YELLOW') condition = t.conditions.yellow;
  else if (condition === 'RED') condition = t.conditions.red;
  else if (condition === 'DOCKED') condition = t.conditions.docked;
  
  lines.push(`${t.status.condition}: ${condition}`);
  lines.push(`${t.status.quadrant}: [${state.ship.position.quadrant.x},${state.ship.position.quadrant.y}]`);
  lines.push(`${t.status.sector}: [${state.ship.position.sector.x},${state.ship.position.sector.y}]`);
  lines.push(`${t.status.energy}: ${state.ship.energy}`);
  lines.push(`${t.status.torpedoes}: ${state.ship.torpedoes}`);
  lines.push(`${t.status.shields}: ${state.ship.shields} ${state.ship.shieldsUp ? t.messages.shieldsUp : t.messages.shieldsDown2}`);
  lines.push(`${t.status.klingons}: ${state.klingonsRemaining}`);
  
  return lines;
}

export function generateLongRangeScan(state: GameState, t: Translations): string[] {
  const lines: string[] = [];
  
  if (state.ship.systems.longRangeSensors > 0) {
    lines.push(t.messages.longRangeSensorsDamaged);
    return lines;
  }
  
  const qx = state.ship.position.quadrant.x;
  const qy = state.ship.position.quadrant.y;
  
  lines.push(t.messages.longRangeScan);
  lines.push('');
  
  for (let dy = -1; dy <= 1; dy++) {
    let row = '';
    for (let dx = -1; dx <= 1; dx++) {
      const x = qx + dx;
      const y = qy + dy;
      
      if (x < 0 || x >= 8 || y < 0 || y >= 8) {
        row += ' *** ';
      } else {
        const q = state.galaxy[x][y];
        const klingons = q.klingons;
        const starbases = q.starbases;
        const stars = q.stars;
        row += ` ${klingons}${starbases}${stars} `;
      }
    }
    lines.push(row);
  }
  
  lines.push('');
  lines.push(t.messages.lrsFormat);
  
  return lines;
}

export function generateGalaxyMap(state: GameState, t: Translations): string[] {
  const lines: string[] = [];
  
  lines.push(t.messages.galaxyMap);
  lines.push('  0 1 2 3 4 5 6 7');
  
  for (let y = 0; y < 8; y++) {
    let row = y + ' ';
    for (let x = 0; x < 8; x++) {
      const q = state.galaxy[x][y];
      
      if (x === state.ship.position.quadrant.x && y === state.ship.position.quadrant.y) {
        row += '@';
      } else if (!q.visited) {
        row += '?';
      } else if (q.klingons > 0) {
        row += 'K';
      } else if (q.starbases > 0) {
        row += 'B';
      } else {
        row += '.';
      }
      row += ' ';
    }
    lines.push(row);
  }
  
  lines.push('');
  lines.push(t.messages.galaxyMapLegend);
  
  return lines;
}

export function generateStatusReport(state: GameState, t: Translations): string[] {
  const lines: string[] = [];
  
  lines.push(t.messages.statusReport);
  lines.push('');
  lines.push(`${t.status.stardate}: ${state.stardate.toFixed(1)}`);
  lines.push(`${t.status.timeRemaining}: ${state.timeRemaining}`);
  lines.push(`${t.status.klingons}: ${state.klingonsRemaining}`);
  lines.push(`${t.status.starbases}: ${countStarbases(state.galaxy)}`);
  lines.push('');
  lines.push(`${t.status.energy}: ${state.ship.energy}`);
  lines.push(`${t.status.torpedoes}: ${state.ship.torpedoes}`);
  lines.push(`${t.status.shields}: ${state.ship.shields}`);
  lines.push('');
  lines.push(t.messages.systemsStatus);
  
  const systemNames: Record<keyof ShipSystems, string> = {
    warpEngines: t.systems.warpEngines,
    shortRangeSensors: t.systems.shortRangeSensors,
    longRangeSensors: t.systems.longRangeSensors,
    phaserControl: t.systems.phaserControl,
    photonTubes: t.systems.photonTubes,
    damageControl: t.systems.damageControl,
    shields: t.systems.shields,
    computer: t.systems.computer,
  };
  
  const systemKeys = Object.keys(state.ship.systems) as (keyof ShipSystems)[];
  
  for (const key of systemKeys) {
    const damage = state.ship.systems[key];
    const status = damage === 0 ? t.systems.operational : `${t.systems.damaged} (${damage.toFixed(1)})`;
    lines.push(`  ${systemNames[key]}: ${status}`);
  }
  
  return lines;
}

function countStarbases(galaxy: Quadrant[][]): number {
  let total = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      total += galaxy[x][y].starbases;
    }
  }
  return total;
}

export function generateHelp(t: Translations): string[] {
  return [
    t.help.title,
    '',
    t.help.nav,
    t.help.srs,
    t.help.lrs,
    t.help.pha,
    t.help.tor,
    t.help.she,
    t.help.dam,
    t.help.com,
    t.help.sta,
    t.help.doc,
    t.help.hel,
    t.help.xxx,
    t.help.lang,
    '',
    t.help.courses,
    '',
    t.help.mapSymbols,
    t.help.enterprise,
    t.help.klingon,
    t.help.starbase,
    t.help.star,
    t.help.emptySpace,
  ];
}
