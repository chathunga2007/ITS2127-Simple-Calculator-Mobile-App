import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AppTheme } from '@/constants/theme';
import { formatExpression } from '@/utils/calculatorLogic';

interface CalculatorDisplayProps {
  expression: string;
  previewResult: string | null;
  theme: AppTheme;
  onBackspace: () => void;
  onClear: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  previewResult,
  theme,
  onBackspace,
  onClear,
}) => {
  const formattedExpr = formatExpression(expression);

  // Dynamic font sizing based on expression length
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len > 16) return 32;
    if (len > 12) return 40;
    if (len > 8) return 48;
    return 56;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.displayBg }]}>
      {/* Expression line with history feel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expressionScroll}
      >
        <Text style={[styles.expressionText, { color: theme.textSecondary }]}>
          {formattedExpr}
        </Text>
      </ScrollView>

      {/* Main result & live preview row */}
      <View style={styles.resultRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resultScroll}
        >
          <Text
            selectable
            style={[
              styles.mainText,
              {
                color: theme.textPrimary,
                fontSize: getFontSize(formattedExpr),
              },
            ]}
          >
            {formattedExpr}
          </Text>
        </ScrollView>

        {/* Backspace Icon button */}
        <Pressable
          onPress={onBackspace}
          onLongPress={onClear}
          delayLongPress={400}
          hitSlop={12}
          style={({ pressed }) => [
            styles.backspaceButton,
            {
              backgroundColor: pressed ? theme.btnFunctionActive : theme.btnFunction,
              opacity: expression === '0' ? 0.35 : 1,
            },
          ]}
          disabled={expression === '0'}
        >
          <Text style={[styles.backspaceText, { color: theme.btnFunctionText }]}>
            ⌫
          </Text>
        </Pressable>
      </View>

      {/* Live Preview of calculation result if typing */}
      {previewResult && previewResult !== expression && (
        <View style={styles.previewContainer}>
          <Text style={[styles.previewText, { color: theme.accent }]}>
            = {formatExpression(previewResult)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 16,
    minHeight: 160,
    justifyContent: 'flex-end',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  expressionScroll: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  expressionText: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultScroll: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexGrow: 1,
    paddingRight: 10,
  },
  mainText: {
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  backspaceButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  backspaceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

