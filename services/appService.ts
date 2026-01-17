import { AppInfo, AppStats } from '@/types/app';

// Mock data generator for running apps
const SAMPLE_APPS = [
  { name: 'Chrome', packageName: 'com.android.chrome', memoryUsage: 185, icon: '🌐' },
  { name: 'WhatsApp', packageName: 'com.whatsapp', memoryUsage: 142, icon: '💬' },
  { name: 'YouTube', packageName: 'com.google.android.youtube', memoryUsage: 268, icon: '▶️' },
  { name: 'Telegram', packageName: 'org.telegram.messenger', memoryUsage: 98, icon: '✈️' },
  { name: 'Instagram', packageName: 'com.instagram.android', memoryUsage: 156, icon: '📷' },
  { name: 'Gmail', packageName: 'com.google.android.gm', memoryUsage: 87, icon: '📧' },
  { name: 'Spotify', packageName: 'com.spotify.music', memoryUsage: 124, icon: '🎵' },
  { name: 'Twitter', packageName: 'com.twitter.android', memoryUsage: 112, icon: '🐦' },
  { name: 'Maps', packageName: 'com.google.android.apps.maps', memoryUsage: 176, icon: '🗺️' },
  { name: 'Settings', packageName: 'com.android.settings', memoryUsage: 45, icon: '⚙️' },
  { name: 'Camera', packageName: 'com.android.camera', memoryUsage: 92, icon: '📸' },
  { name: 'Photos', packageName: 'com.google.android.apps.photos', memoryUsage: 134, icon: '🖼️' },
];

// Simulate getting running apps
export function getRunningApps(): AppInfo[] {
  // Randomly select 6-10 apps as "running"
  const runningCount = Math.floor(Math.random() * 5) + 6;
  const shuffled = [...SAMPLE_APPS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, runningCount);
  
  return selected.map((app, index) => ({
    id: app.packageName,
    name: app.name,
    packageName: app.packageName,
    icon: app.icon,
    memoryUsage: app.memoryUsage + Math.floor(Math.random() * 40 - 20),
    isRunning: true,
    pid: 1000 + index,
    version: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}`,
    lastUsed: new Date(Date.now() - Math.random() * 3600000),
  }));
}

export function getAppStats(apps: AppInfo[]): AppStats {
  const totalMemory = 4096; // 4GB
  const usedMemory = apps.reduce((sum, app) => sum + app.memoryUsage, 0);
  
  return {
    totalApps: SAMPLE_APPS.length,
    runningApps: apps.length,
    totalMemory,
    usedMemory,
  };
}

export function searchApps(apps: AppInfo[], query: string): AppInfo[] {
  if (!query.trim()) return apps;
  
  const lowerQuery = query.toLowerCase();
  return apps.filter(
    app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.packageName.toLowerCase().includes(lowerQuery)
  );
}

export function sortAppsByMemory(apps: AppInfo[], ascending = false): AppInfo[] {
  return [...apps].sort((a, b) =>
    ascending ? a.memoryUsage - b.memoryUsage : b.memoryUsage - a.memoryUsage
  );
}

export function formatMemory(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb.toFixed(0)} MB`;
}

export function formatMemoryPercent(used: number, total: number): number {
  return Math.round((used / total) * 100);
}
