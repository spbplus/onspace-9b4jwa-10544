import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface GameHeaderProps {
  onNewGame: () => void;
  onHelp: () => void;
}

export function GameHeader({ onNewGame, onHelp }: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="rocket" size={24} color={theme.colors.terminalText} />
        <Text style={styles.title}>SUPER STAR TREK</Text>
      </View>
      
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onHelp}
        >
          <Ionicons name="help-circle-outline" size={24} color={theme.colors.terminalText} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onNewGame}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.terminalText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.terminalText,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    padding: theme.spacing.xs,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
