import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  onPress,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = styles.base;

    // Size
    if (size === 'sm') base = { ...base, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 };
    if (size === 'md') base = { ...base, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 };
    if (size === 'lg') base = { ...base, paddingVertical: 18, paddingHorizontal: 24, borderRadius: 14 };

    // Variant
    switch (variant) {
      case 'primary':
        base = { ...base, backgroundColor: colors.primary };
        break;
      case 'secondary':
        base = { ...base, backgroundColor: colors.secondary };
        break;
      case 'outline':
        base = { ...base, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.gray300 };
        break;
      case 'ghost':
        base = { ...base, backgroundColor: 'transparent' };
        break;
      case 'danger':
        base = { ...base, backgroundColor: colors.danger };
        break;
    }

    if (disabled || loading) {
      base = { ...base, opacity: 0.6 };
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let baseText: TextStyle = styles.text;

    if (size === 'sm') baseText = { ...baseText, fontSize: 13 };
    if (size === 'md') baseText = { ...baseText, fontSize: 15 };
    if (size === 'lg') baseText = { ...baseText, fontSize: 17 };

    switch (variant) {
      case 'outline':
      case 'ghost':
        baseText = { ...baseText, color: colors.gray800 };
        break;
      default:
        baseText = { ...baseText, color: colors.textWhite };
        break;
    }

    return baseText;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textWhite} />
      ) : (
        <>
          {icon ? <React.Fragment>{icon}</React.Fragment> : null}
          <Text style={[getTextStyle(), icon ? { marginLeft: 8 } : undefined, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
