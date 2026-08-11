import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  variant?: 'flat' | 'elevated' | 'bordered';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ style, variant = 'elevated', children, ...props }) => {
  const getCardStyle = (): ViewStyle => {
    let base: ViewStyle = styles.card;

    if (variant === 'elevated') {
      base = {
        ...base,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      };
    } else if (variant === 'bordered') {
      base = {
        ...base,
        borderWidth: 1.5,
        borderColor: colors.gray200,
        elevation: 0,
      };
    } else {
      base = {
        ...base,
        backgroundColor: colors.gray50,
        elevation: 0,
      };
    }

    return base;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
});
