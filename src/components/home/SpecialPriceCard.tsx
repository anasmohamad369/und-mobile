import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Tag, ArrowRight } from 'lucide-react-native';

interface SpecialPriceCardProps {
  marketPrice?: number;
  specialPrice?: number;
  discountAmount?: number;
  onBuyNow: () => void;
}

export const SpecialPriceCard: React.FC<SpecialPriceCardProps> = ({
  marketPrice = 150,
  specialPrice = 145,
  discountAmount = 5,
  onBuyNow,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.cardContainer}>
      {/* Top Left Red Ribbon Badge matching reference mockup */}
      <View style={styles.ribbonBadge}>
        <View style={styles.ribbonMain}>
          <Text style={styles.ribbonSubtext}>NUTRIFARM</Text>
          <Text style={styles.ribbonTitle}>SPECIAL PRICE</Text>
        </View>
        {/* Pointer V-shape tail at bottom */}
        <View style={styles.ribbonTail} />
      </View>

      {/* Header Title Section: Padded left by 100px so title NEVER overlaps ribbon */}
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>{t('specialPriceTitle')}</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Main Content Row */}
      <View style={styles.contentRow}>
        {/* Left Side: Cut-out 3D White Broiler Chicken Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../../assets/special-price-hero.png')}
            style={styles.chickenImage}
            resizeMode="contain"
          />
        </View>

        {/* Right Side: Price Breakdown & Buy Action */}
        <View style={styles.detailsCol}>
          {/* Price Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Market Price */}
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('marketPrice')}</Text>
              <Text style={styles.strikethroughPrice}>
                ₹{marketPrice}.00 <Text style={styles.unitText}>/kg</Text>
              </Text>
            </View>

            <View style={styles.metricDivider} />

            {/* You Save */}
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('youSave')}</Text>
              <Text style={styles.savePrice}>
                ₹{discountAmount}.00 <Text style={styles.unitText}>/kg</Text>
              </Text>
            </View>

            {/* NutriFarm Price Highlight Box */}
            <View style={styles.metricItemHighlight}>
              <Text style={styles.highlightLabel}>{t('nutrifarmPrice')}</Text>
              <Text style={styles.finalPrice}>
                ₹<Text style={styles.finalPriceBig}>{specialPrice}.00</Text> <Text style={styles.finalUnit}>/kg</Text>
              </Text>
            </View>
          </View>

          {/* Discount Online Tag */}
          <View style={styles.discountTagBox}>
            <Tag size={15} color="#0A5D36" style={{ marginRight: 6 }} />
            <Text style={styles.discountTagText}>{t('onlineOfferTag')}</Text>
          </View>

          {/* Big Orange BUY NOW Button */}
          <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.88} onPress={onBuyNow}>
            <Text style={styles.buyNowBtnText}>{t('buyNow')}</Text>
            <View style={styles.btnArrowCircle}>
              <ArrowRight size={16} color="#FF4D00" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Disclaimer at bottom */}
      <Text style={styles.disclaimerText}>{t('codDisclaimer')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFDFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFE4D6',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    marginVertical: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  ribbonBadge: {
    position: 'absolute',
    top: 0,
    left: 14,
    width: 86,
    zIndex: 10,
  },
  ribbonMain: {
    backgroundColor: '#E52E2E',
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
  },
  ribbonSubtext: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  ribbonTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginTop: 1,
  },
  ribbonTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 43,
    borderRightWidth: 43,
    borderTopWidth: 12,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E52E2E',
  },
  titleContainer: {
    paddingLeft: 96,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#E64A19',
    lineHeight: 20,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#FFE4D6',
    marginTop: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  imageWrapper: {
    width: 90,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  chickenImage: {
    width: '100%',
    height: '100%',
  },
  detailsCol: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 2,
  },
  strikethroughPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.gray900,
    textDecorationLine: 'line-through',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray500,
    textDecorationLine: 'none',
  },
  savePrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16A34A',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#FFE4D6',
    marginHorizontal: 2,
  },
  metricItemHighlight: {
    backgroundColor: '#FFF0EA',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD6C6',
    alignItems: 'flex-start',
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E64A19',
  },
  finalPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF4D00',
  },
  finalPriceBig: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF4D00',
  },
  finalUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF4D00',
  },
  discountTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF7F2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D2ECE0',
    marginBottom: 10,
  },
  discountTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A5D36',
    flex: 1,
    lineHeight: 14,
  },
  buyNowBtn: {
    backgroundColor: '#FF4D00',
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  buyNowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginRight: 10,
  },
  btnArrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#D32F2F',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});

