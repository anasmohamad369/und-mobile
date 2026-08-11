import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface OfflineBannerProps {
  isOffline?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline = false }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={16} color={colors.textWhite} style={{ marginRight: 8 }} />
      <Text style={styles.text}>You're offline. We'll reconnect automatically.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray800,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});
