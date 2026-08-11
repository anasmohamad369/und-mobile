import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';
import { PackageCheck } from 'lucide-react-native';

interface StockCardProps {
  availableKg?: number;
}

export const StockCard: React.FC<StockCardProps> = ({ availableKg = 4250 }) => {
  return (
    <Card variant="bordered" style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <PackageCheck size={22} color={colors.success} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.label}>Available for Purchase</Text>
          <Text style={styles.kgValue}>{availableKg.toLocaleString()} KG</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kgValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 2,
  },
});
