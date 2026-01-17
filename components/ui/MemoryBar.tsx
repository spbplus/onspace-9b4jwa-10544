import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { formatMemory, formatMemoryPercent } from '@/services/appService';

interface MemoryBarProps {
  usedMemory: number;
  totalMemory: number;
}

export function MemoryBar({ usedMemory, totalMemory }: MemoryBarProps) {
  const percent = formatMemoryPercent(usedMemory, totalMemory);
  const color =
    percent >= 80
      ? theme.colors.danger
      : percent >= 60
      ? theme.colors.warning
      : theme.colors.success;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Использование памяти</Text>
        <Text style={[styles.percent, { color }]}>{percent}%</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.details}>
        {formatMemory(usedMemory)} из {formatMemory(totalMemory)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  percent: {
    ...theme.typography.subtitle,
    fontWeight: '700',
  },
  barContainer: {
    height: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  details: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
