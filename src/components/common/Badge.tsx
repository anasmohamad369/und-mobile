import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { OrderStatus } from '../../types';

interface BadgeProps {
  label?: string;
  status?: OrderStatus | 'ACTIVE' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ label, status, variant }) => {
  const getColors = (): { bg: string; text: string } => {
    if (variant) {
      switch (variant) {
        case 'success': return { bg: colors.successLight, text: colors.success };
        case 'warning': return { bg: colors.warningLight, text: colors.warning };
        case 'danger': return { bg: colors.dangerLight, text: colors.danger };
        case 'info': return { bg: colors.infoLight, text: colors.info };
        default: return { bg: colors.gray100, text: colors.gray700 };
      }
    }

    switch (status) {
      case 'CONFIRMED':
      case 'PAID':
      case 'COMPLETED':
      case 'ACTIVE':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'OUT_FOR_DELIVERY':
      case 'DRIVER_ASSIGNED':
      case 'IN_PROGRESS':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'DELIVERED':
        return { bg: '#ECFDF5', text: '#047857' };
      case 'PENDING_PAYMENT':
      case 'PLANNED':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'FAILED':
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: colors.gray100, text: colors.gray700 };
    }
  };

  const formattedLabel = label || status?.replace(/_/g, ' ') || 'ACTIVE';
  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{formattedLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
