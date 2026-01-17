import { useState, useEffect, useCallback } from 'react';
import { AppInfo, AppStats } from '@/types/app';
import {
  getRunningApps,
  getAppStats,
  searchApps,
  sortAppsByMemory,
} from '@/services/appService';

const REFRESH_INTERVAL = 3000; // 3 seconds

export function useRunningApps() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const [stats, setStats] = useState<AppStats>({
    totalApps: 0,
    runningApps: 0,
    totalMemory: 0,
    usedMemory: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescending, setSortDescending] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadApps = useCallback(() => {
    const runningApps = getRunningApps();
    setApps(runningApps);
    setStats(getAppStats(runningApps));
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    loadApps();
    setIsRefreshing(false);
  }, [loadApps]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const searched = searchApps(apps, query);
      const sorted = sortAppsByMemory(searched, !sortDescending);
      setFilteredApps(sorted);
    },
    [apps, sortDescending]
  );

  const toggleSort = useCallback(() => {
    setSortDescending(prev => !prev);
  }, []);

  const killApp = useCallback(
    (packageName: string) => {
      setApps(prev => {
        const updated = prev.filter(app => app.packageName !== packageName);
        setStats(getAppStats(updated));
        return updated;
      });
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadApps();
  }, [loadApps]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      loadApps();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadApps]);

  // Update filtered apps when apps or sort changes
  useEffect(() => {
    const searched = searchApps(apps, searchQuery);
    const sorted = sortAppsByMemory(searched, !sortDescending);
    setFilteredApps(sorted);
  }, [apps, searchQuery, sortDescending]);

  return {
    apps: filteredApps,
    stats,
    searchQuery,
    sortDescending,
    isRefreshing,
    loading,
    handleSearch,
    toggleSort,
    refresh,
    killApp,
  };
}
