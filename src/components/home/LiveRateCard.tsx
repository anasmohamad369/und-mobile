import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { CircleRate } from '../../data/circlesData';
import { useLanguage } from '../../context/LanguageContext';
import { TrendingUp, RefreshCw, ChevronRight, ChevronDown } from 'lucide-react-native';

interface LiveRateCardProps {
  selectedCircle: CircleRate;
  onOpenCircleModal: () => void;
  onBuyPress: () => void;
}

export const LiveRateCard: React.FC<LiveRateCardProps> = ({
  selectedCircle,
  onOpenCircleModal,
  onBuyPress,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Bar in Dark Green */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <TrendingUp size={16} color={colors.secondary} />
          </View>
          <Text style={styles.headerTitle}>{t('liveMarketPriceTitle')}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.updatedText}>{t('lastUpdated')} {selectedCircle.lastUpdated}</Text>
          <RefreshCw size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Main Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.rowContent}>
          {/* Left Column: Area / Circle */}
          <View style={styles.areaCol}>
            <Text style={styles.fieldLabel}>{t('areaCircle')}</Text>
            <TouchableOpacity style={styles.circleDropdown} activeOpacity={0.7} onPress={onOpenCircleModal}>
              <Text style={styles.circleText} numberOfLines={1}>
                {selectedCircle.name}
              </Text>
              <ChevronDown size={18} color={colors.gray800} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Vertical Divider */}
          <View style={styles.divider} />

          {/* Right Column: Market Price */}
          <View style={styles.priceCol}>
            <Text style={styles.fieldLabel}>{t('marketPrice')}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceSymbol}>₹</Text>
              <Text style={styles.priceValue}>{selectedCircle.marketPrice}.00</Text>
              <Text style={styles.priceUnit}> /kg</Text>
            </View>
          </View>
        </View>

        {/* Bottom Link: View price in other areas */}
        <TouchableOpacity style={styles.bottomLink} activeOpacity={0.7} onPress={onOpenCircleModal}>
          <Text style={styles.bottomLinkText}>{t('viewPriceInOtherAreas')}</Text>
          <View style={styles.arrowCircle}>
            <ChevronRight size={14} color="#0A5D36" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  topHeader: {
    backgroundColor: '#0A5D36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatedText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    padding: 16,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  areaCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 4,
  },
  circleDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  priceCol: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0A5D36',
    marginLeft: 2,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
    marginLeft: 2,
  },
  bottomLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  bottomLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A5D36',
    marginRight: 6,
  },
  arrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0A5D36',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

