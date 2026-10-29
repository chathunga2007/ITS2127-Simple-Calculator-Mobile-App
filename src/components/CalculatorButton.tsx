import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ButtonType } from '@/types/calculator';
import { AppTheme } from '@/constants/theme';

interface CalculatorButtonProps {
  label: string;
  type: ButtonType;
  theme: AppTheme;
  onPress: () => void;
  flex?: number;
  testID?: string;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  type,
  theme,
  onPress,
  flex = 1,
  testID,
}) => {
  // Determine button background and text colors based on type
  const getButtonColors = (isPressed: boolean) => {
    switch (type) {
      case 'operator':
        return {
          bg: isPressed ? theme.btnOperatorActive : theme.btnOperator,
          text: theme.btnOperatorText,
        };
      case 'function':
        return {
          bg: isPressed ? theme.btnFunctionActive : theme.btnFunction,
          text: theme.btnFunctionText,
        };
      case 'equal':
        return {
          bg: isPressed ? theme.btnEqualActive : theme.btnEqual,
          text: theme.btnEqualText,
        };
      case 'digit':
      default:
        return {
          bg: isPressed ? theme.btnNumberActive : theme.btnNumber,
          text: theme.btnNumberText,
        };
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        {
          flex,
          backgroundColor: getButtonColors(pressed).bg,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.buttonText,
            { color: getButtonColors(pressed).text },
            type === 'operator' || type === 'equal' ? styles.operatorText : undefined,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: 72,
    margin: 6,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  operatorText: {
    fontSize: 30,
    fontWeight: '700',
  },
});

