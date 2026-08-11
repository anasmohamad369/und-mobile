import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';
import { LiveRate } from '../../types';
import { TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react-native';

interface LiveRateCardProps {
  rate: LiveRate | null;
  onBuyPress: () => void;
}

export const LiveRateCard: React.FC<LiveRateCardProps> = ({ rate, onBuyPress }) => {
  const currentRate = rate ? rate.ratePerKg : 102;
  const previousRate = rate?.previousRatePerKg;
  const isUp = previousRate ? currentRate > previousRate : false;
  const isDown = previousRate ? currentRate < previousRate : false;

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.topHeader}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>LIVE RATE</Text>
        </View>
        <Text style={styles.updatedText}>
          Updated {rate?.updatedAt || 'Just now'}
        </Text>
      </View>

      <View style={styles.rateRow}>
        <View style={styles.rateContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.rateValue}>{currentRate}</Text>
          <Text style={styles.perKgUnit}> / KG</Text>
        </View>

        {previousRate && (isUp || isDown) && (
          <View
            style={[
              styles.changeBadge,
              isUp ? styles.changeUp : styles.changeDown,
            ]}
          >
            {isUp ? (
              <TrendingUp size={16} color={colors.danger} />
            ) : (
              <TrendingDown size={16} color={colors.success} />
            )}
            <Text
              style={[
                styles.changeText,
                { color: isUp ? colors.danger : colors.success },
              ]}
            >
              {isUp ? `+₹${currentRate - previousRate}` : `-₹${previousRate - currentRate}`}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.farmSubtext}>
        {rate?.farmName || 'Gujarat Wholesale Supply Network'}
      </Text>

      <Button
        title="BUY CHICKEN"
        variant="primary"
        size="lg"
        icon={<ShoppingBag size={20} color={colors.textWhite} />}
        onPress={onBuyPress}
        style={styles.buyButton}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 29, 72, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  liveBadgeText: {
    color: '#FF6B81',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  updatedText: {
    color: colors.gray400,
    fontSize: 12,
    fontWeight: '500',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textWhite,
  },
  rateValue: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.textWhite,
    letterSpacing: -1,
  },
  perKgUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray400,
    marginLeft: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  changeUp: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  changeDown: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  farmSubtext: {
    color: colors.gray400,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 18,
  },
  buyButton: {
    backgroundColor: colors.primary,
  },
});
