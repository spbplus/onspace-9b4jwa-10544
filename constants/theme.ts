export const theme = {
  colors: {
    // Terminal colors
    terminalBg: '#000000',
    terminalText: '#00FF00',
    terminalDim: '#00AA00',
    terminalBright: '#66FF66',
    terminalError: '#FF0000',
    terminalWarning: '#FFAA00',
    terminalInfo: '#00AAFF',
    
    // UI colors
    primary: '#00FF00',
    secondary: '#00AAFF',
    background: '#000000',
    surface: '#0A0A0A',
    surfaceAlt: '#151515',
    border: '#00AA00',
    text: '#00FF00',
    textSecondary: '#00AA00',
    textMuted: '#006600',
    error: '#FF0000',
    warning: '#FFAA00',
    success: '#00FF00',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  typography: {
    title: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
      fontFamily: 'monospace',
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      fontFamily: 'monospace',
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 18,
      fontFamily: 'monospace',
    },
  },
};
