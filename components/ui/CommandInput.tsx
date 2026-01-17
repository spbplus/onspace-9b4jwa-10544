import { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

export function CommandInput({ onSubmit, disabled = false }: CommandInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputRow}>
        <Text style={styles.prompt}>{'>'}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          placeholder="Enter command..."
          placeholderTextColor={theme.colors.textMuted}
          editable={!disabled}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="send"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={disabled}
        >
          <Ionicons name="send" size={20} color={theme.colors.terminalText} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  prompt: {
    ...theme.typography.body,
    color: theme.colors.terminalText,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.terminalText,
    backgroundColor: theme.colors.terminalBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    includeFontPadding: false,
  },
  button: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.terminalBg,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
});
