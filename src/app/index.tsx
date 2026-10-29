import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, ThemeMode } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CalculatorButton } from '@/components/CalculatorButton';
import { CalculatorDisplay } from '@/components/CalculatorDisplay';
import { HistoryModal } from '@/components/HistoryModal';
import { HistoryItem } from '@/types/calculator';
import {
  calculateExpression,
  handleDigitPress,
  handleOperatorPress,
  handleDecimalPress,
  handleBackspacePress,
  handleSignToggle,
  handlePercentagePress,
} from '@/utils/calculatorLogic';

export default function CalculatorScreen() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    systemScheme === 'dark' ? 'dark' : 'dark'
  );

  const theme = Colors[themeMode];

  // Calculator state
  const [expression, setExpression] = useState<string>('0');
  const [isResultShowing, setIsResultShowing] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string>('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Live preview calculation when typing an expression
  const previewResult = useMemo(() => {
    if (isResultShowing) return null;
    if (!expression || expression === '0') return null;

    // Only compute preview if expression contains an operator
    const hasOperator = /[+−×÷]/.test(expression);
    if (!hasOperator) return null;

    const calc = calculateExpression(expression);
    return calc.success && calc.result !== expression ? calc.result : null;
  }, [expression, isResultShowing]);

  // Button Action Handlers
  const onDigit = useCallback(
    (digit: string) => {
      setExpression((prev) => handleDigitPress(prev, digit, isResultShowing));
      if (isResultShowing) {
        setIsResultShowing(false);
      }
    },
    [isResultShowing]
  );

  const onOperator = useCallback(
    (operator: string) => {
      setExpression((prev) => handleOperatorPress(prev, operator, isResultShowing, lastResult));
      setIsResultShowing(false);
    },
    [isResultShowing, lastResult]
  );

  const onDecimal = useCallback(() => {
    setExpression((prev) => handleDecimalPress(prev, isResultShowing));
    if (isResultShowing) {
      setIsResultShowing(false);
    }
  }, [isResultShowing]);

  const onBackspace = useCallback(() => {
    setExpression((prev) => handleBackspacePress(prev, isResultShowing));
    if (isResultShowing) {
      setIsResultShowing(false);
    }
  }, [isResultShowing]);

  const onClear = useCallback(() => {
    setExpression('0');
    setLastResult('0');
    setIsResultShowing(false);
  }, []);

  const onToggleSign = useCallback(() => {
    setExpression((prev) => handleSignToggle(prev, isResultShowing, lastResult));
  }, [isResultShowing, lastResult]);

  const onPercentage = useCallback(() => {
    setExpression((prev) => handlePercentagePress(prev, isResultShowing, lastResult));
  }, [isResultShowing, lastResult]);

  const onEquals = useCallback(() => {
    if (!expression || expression === '0') return;

    const calc = calculateExpression(expression);
    if (calc.success) {
      // Save to calculation history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expression,
        result: calc.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // keep up to 50 calculations
      setLastResult(calc.result);
      setExpression(calc.result);
      setIsResultShowing(true);
    } else {
      setExpression(calc.result || 'Error');
      setIsResultShowing(true);
    }
  }, [expression]);

  const onSelectHistoryItem = useCallback((item: HistoryItem) => {
    setExpression(item.result);
    setLastResult(item.result);
    setIsResultShowing(true);
  }, []);

  const onClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.branding}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Calculator</Text>
            <View style={[styles.badge, { backgroundColor: theme.btnFunction }]}>
              <Text style={[styles.badgeText, { color: theme.accent }]}>PRO</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            {/* Theme Switcher Button */}
            <Pressable
              onPress={toggleTheme}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? theme.btnFunctionActive : theme.btnFunction,
                },
              ]}
            >
              <Text style={styles.iconButtonText}>{themeMode === 'dark' ? '☀️' : '🌙'}</Text>
            </Pressable>

            {/* History Button */}
            <Pressable
              onPress={() => setIsHistoryVisible(true)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? theme.btnFunctionActive : theme.btnFunction,
                },
              ]}
            >
              <Text style={styles.iconButtonText}>🕒</Text>
              {history.length > 0 && <View style={[styles.historyDot, { backgroundColor: theme.accent }]} />}
            </Pressable>
          </View>
        </View>

        {/* Display Area */}
        <CalculatorDisplay
          expression={expression}
          previewResult={previewResult}
          theme={theme}
          onBackspace={onBackspace}
          onClear={onClear}
        />

        {/* Keypad Grid */}
        <View style={styles.keypad}>
          {/* Row 1 */}
          <View style={styles.row}>
            <CalculatorButton
              label={expression === '0' ? 'AC' : 'C'}
              type="function"
              theme={theme}
              onPress={onClear}
            />
            <CalculatorButton
              label="±"
              type="function"
              theme={theme}
              onPress={onToggleSign}
            />
            <CalculatorButton
              label="%"
              type="function"
              theme={theme}
              onPress={onPercentage}
            />
            <CalculatorButton
              label="÷"
              type="operator"
              theme={theme}
              onPress={() => onOperator('÷')}
            />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <CalculatorButton label="7" type="digit" theme={theme} onPress={() => onDigit('7')} />
            <CalculatorButton label="8" type="digit" theme={theme} onPress={() => onDigit('8')} />
            <CalculatorButton label="9" type="digit" theme={theme} onPress={() => onDigit('9')} />
            <CalculatorButton
              label="×"
              type="operator"
              theme={theme}
              onPress={() => onOperator('×')}
            />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <CalculatorButton label="4" type="digit" theme={theme} onPress={() => onDigit('4')} />
            <CalculatorButton label="5" type="digit" theme={theme} onPress={() => onDigit('5')} />
            <CalculatorButton label="6" type="digit" theme={theme} onPress={() => onDigit('6')} />
            <CalculatorButton
              label="−"
              type="operator"
              theme={theme}
              onPress={() => onOperator('−')}
            />
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <CalculatorButton label="1" type="digit" theme={theme} onPress={() => onDigit('1')} />
            <CalculatorButton label="2" type="digit" theme={theme} onPress={() => onDigit('2')} />
            <CalculatorButton label="3" type="digit" theme={theme} onPress={() => onDigit('3')} />
            <CalculatorButton
              label="+"
              type="operator"
              theme={theme}
              onPress={() => onOperator('+')}
            />
          </View>

          {/* Row 5 */}
          <View style={styles.row}>
            <CalculatorButton label="0" type="digit" theme={theme} onPress={() => onDigit('0')} />
            <CalculatorButton label="00" type="digit" theme={theme} onPress={() => onDigit('00')} />
            <CalculatorButton label="." type="digit" theme={theme} onPress={onDecimal} />
            <CalculatorButton label="=" type="equal" theme={theme} onPress={onEquals} />
          </View>
        </View>
      </View>

      {/* History Drawer Modal */}
      <HistoryModal
        visible={isHistoryVisible}
        history={history}
        theme={theme}
        onClose={() => setIsHistoryVisible(false)}
        onSelectHistory={onSelectHistoryItem}
        onClearHistory={onClearHistory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonText: {
    fontSize: 18,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 6,
    right: 6,
  },
  keypad: {
    paddingHorizontal: 12,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
