import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { AppInfo } from '@/types/app';
import { formatMemory } from '@/services/appService';

interface AppListItemProps {
  app: AppInfo;
  onPress: () => void;
  onKill: () => void;
  onOpen: () => void;
}

export function AppListItem({ app, onPress, onKill, onOpen }: AppListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{app.icon}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {app.name}
        </Text>
        <Text style={styles.packageName} numberOfLines={1}>
          {app.packageName}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="hardware-chip-outline" size={12} color={theme.colors.textMuted} />
            <Text style={styles.statText}>PID: {app.pid}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="speedometer-outline" size={12} color={theme.colors.info} />
            <Text style={[styles.statText, { color: theme.colors.info }]}>
              {formatMemory(app.memoryUsage)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={e => {
            e.stopPropagation();
            onOpen();
          }}
          hitSlop={8}
        >
          <Ionicons name="play-circle" size={24} color={theme.colors.success} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={e => {
            e.stopPropagation();
            onKill();
          }}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={24} color={theme.colors.danger} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  name: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  packageName: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: 4,
  },
  actionPressed: {
    opacity: 0.5,
  },
});
