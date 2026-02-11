import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';
import { useStarTrek } from '@/hooks/useStarTrek';
import { useLocalization } from '@/hooks/useLocalization';
import { Terminal } from '@/components/ui/Terminal';
import { CommandInput } from '@/components/ui/CommandInput';
import { GameHeader } from '@/components/ui/GameHeader';
import { generateHelp } from '@/services/displayEngine';

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLocalization();
  const { gameState, logs, processCommand, promptDifficultySelection } = useStarTrek();

  const handleNewGame = () => {
    if (gameState && !gameState.destroyed && !gameState.won) {
      Alert.alert(
        'New Game',
        language === 'en' 
          ? 'Start a new mission? Current progress will be lost.'
          : 'Начать новую миссию? Текущий прогресс будет потерян.',
        [
          { text: language === 'en' ? 'Cancel' : 'Отмена', style: 'cancel' },
          {
            text: language === 'en' ? 'New Game' : 'Новая игра',
            style: 'destructive',
            onPress: () => promptDifficultySelection(),
          },
        ]
      );
    } else {
      promptDifficultySelection();
    }
  };

  const handleHelp = () => {
    const helpLines = generateHelp(t);
    Alert.alert('Commands', helpLines.join('\n'));
  };

  const handleCommand = (input: string) => {
    const trimmed = input.trim().toUpperCase();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    
    // Handle LANG command separately
    if (cmd === 'LANG') {
      if (args.length < 1) {
        Alert.alert('Language', t.messages.usageLang);
      } else if (args[0] === 'EN' || args[0] === 'RU') {
        const newLang = args[0].toLowerCase() as 'en' | 'ru';
        setLanguage(newLang);
        Alert.alert('Language', t.messages.languageChanged(newLang));
      } else {
        Alert.alert('Language', t.messages.availableLanguages);
      }
      return;
    }
    
    // Process other commands
    processCommand(input);
  };

  const isGameOver = gameState ? (gameState.destroyed || gameState.won) : false;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <GameHeader onNewGame={handleNewGame} onHelp={handleHelp} />
        
        <Terminal logs={logs} />
        
        <View style={{ paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }}>
          <CommandInput onSubmit={handleCommand} disabled={isGameOver} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.terminalBg,
  },
  content: {
    flex: 1,
  },
});
