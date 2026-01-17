import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { LogEntry } from '@/types/game';

interface TerminalProps {
  logs: LogEntry[];
}

export function Terminal({ logs }: TerminalProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [logs]);

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return theme.colors.terminalError;
      case 'warning':
        return theme.colors.terminalWarning;
      case 'info':
        return theme.colors.terminalInfo;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.terminalText;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log, index) => (
          <Text
            key={`${log.timestamp}-${index}`}
            style={[styles.text, { color: getColor(log.type) }]}
          >
            {log.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.terminalBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.terminalText,
    marginBottom: 2,
  },
});
