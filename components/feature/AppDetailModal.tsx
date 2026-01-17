import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { AppInfo } from '@/types/app';
import { formatMemory } from '@/services/appService';

interface AppDetailModalProps {
  app: AppInfo | null;
  visible: boolean;
  onClose: () => void;
  onKill: () => void;
  onOpen: () => void;
}

export function AppDetailModal({ app, visible, onClose, onKill, onOpen }: AppDetailModalProps) {
  if (!app) return null;

  const formatDate = (date?: Date) => {
    if (!date) return 'Неизвестно';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч. назад`;
    return `${Math.floor(hours / 24)} дн. назад`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{app.icon}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <Text style={styles.appName}>{app.name}</Text>
          <Text style={styles.packageName}>{app.packageName}</Text>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Основная информация</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="code-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.infoLabelText}>Версия</Text>
                </View>
                <Text style={styles.infoValue}>{app.version || 'Неизвестно'}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="hardware-chip-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.infoLabelText}>ID процесса</Text>
                </View>
                <Text style={styles.infoValue}>{app.pid}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.infoLabelText}>Последнее использование</Text>
                </View>
                <Text style={styles.infoValue}>{formatDate(app.lastUsed)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Использование ресурсов</Text>

              <View style={styles.memoryCard}>
                <View style={styles.memoryHeader}>
                  <Ionicons name="speedometer" size={24} color={theme.colors.info} />
                  <Text style={styles.memoryValue}>{formatMemory(app.memoryUsage)}</Text>
                </View>
                <Text style={styles.memoryLabel}>Занято оперативной памяти</Text>
                <View style={styles.memoryBar}>
                  <View
                    style={[
                      styles.memoryBarFill,
                      {
                        width: `${Math.min((app.memoryUsage / 500) * 100, 100)}%`,
                        backgroundColor: app.memoryUsage > 200 ? theme.colors.warning : theme.colors.success,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Статус</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                <Text style={styles.statusText}>Активно</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.openButton,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                onOpen();
                onClose();
              }}
            >
              <Ionicons name="play-circle" size={20} color={theme.colors.surface} />
              <Text style={styles.openButtonText}>Открыть</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.killButton,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                onKill();
                onClose();
              }}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.danger} />
              <Text style={styles.killButtonText}>Остановить</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxHeight: '80%',
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  appName: {
    ...theme.typography.title,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  packageName: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  content: {
    maxHeight: 400,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoLabelText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  memoryCard: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  memoryValue: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    fontWeight: '700',
  },
  memoryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  memoryBar: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  memoryBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: `${theme.colors.success}15`,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  actionPressed: {
    opacity: 0.7,
  },
  openButton: {
    backgroundColor: theme.colors.success,
  },
  openButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  killButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  killButtonText: {
    ...theme.typography.body,
    color: theme.colors.danger,
    fontWeight: '600',
  },
});
