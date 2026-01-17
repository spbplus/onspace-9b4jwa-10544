export interface AppInfo {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  memoryUsage: number;
  isRunning: boolean;
  pid?: number;
  version?: string;
  lastUsed?: Date;
}

export interface AppStats {
  totalApps: number;
  runningApps: number;
  totalMemory: number;
  usedMemory: number;
}
