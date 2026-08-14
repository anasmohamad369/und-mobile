import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import { colors } from '../../theme/colors';
import { MapPin, Search, CheckCircle2, Circle, TrendingUp, TrendingDown, X } from 'lucide-react-native';

interface CircleRateModalProps {
  visible: boolean;
  selectedCircle: CircleRate;
  onSelectCircle: (circle: CircleRate) => void;
  onClose: () => void;
}

export const CircleRateModal: React.FC<CircleRateModalProps> = ({
  visible,
  selectedCircle,
  onSelectCircle,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCircles = REGIONAL_CIRCLES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Modal Drag Handle */}
              <View style={styles.handleBar} />

              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleBox}>
                  <View style={styles.mapIconCircle}>
                    <MapPin size={20} color="#0A5D36" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>Select Area / Circle</Text>
                    <Text style={styles.modalSub}>Compare live market prices across regions</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                  <X size={20} color={colors.gray600} />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Search size={18} color={colors.gray400} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search market circle (e.g. Kakinada, Eluru)..."
                  placeholderTextColor={colors.gray400}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Circles List */}
              <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
                {filteredCircles.map((circle) => {
                  const isSelected = selectedCircle.id === circle.id;
                  return (
                    <TouchableOpacity
                      key={circle.id}
                      style={[
                        styles.circleCard,
                        isSelected && styles.selectedCircleCard,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        onSelectCircle(circle);
                        onClose();
                      }}
                    >
                      {/* Left: Radio & Name */}
                      <View style={styles.circleInfoLeft}>
                        {isSelected ? (
                          <CheckCircle2 size={22} color="#0A5D36" style={{ marginRight: 10 }} />
                        ) : (
                          <Circle size={22} color={colors.gray300} style={{ marginRight: 10 }} />
                        )}
                        <View>
                          <Text style={[styles.circleName, isSelected && styles.selectedCircleName]}>
                            {circle.name}
                          </Text>
                          <Text style={styles.updatedText}>Updated {circle.lastUpdated}</Text>
                        </View>
                      </View>

                      {/* Right: Price & Trend Badge */}
                      <View style={styles.circleInfoRight}>
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceCurrency}>₹</Text>
                          <Text style={styles.priceAmount}>{circle.marketPrice}.00</Text>
                          <Text style={styles.priceUnit}>/kg</Text>
                        </View>

                        {/* Trend Badge */}
                        <View
                          style={[
                            styles.trendBadge,
                            circle.isUp === true
                              ? styles.trendUp
                              : circle.isUp === false
                              ? styles.trendDown
                              : styles.trendNeutral,
                          ]}
                        >
                          {circle.isUp === true && <TrendingUp size={12} color="#DC2626" style={{ marginRight: 3 }} />}
                          {circle.isUp === false && <TrendingDown size={12} color="#16A34A" style={{ marginRight: 3 }} />}
                          <Text
                            style={[
                              styles.trendText,
                              circle.isUp === true
                                ? { color: '#DC2626' }
                                : circle.isUp === false
                                ? { color: '#16A34A' }
                                : { color: colors.gray600 },
                            ]}
                          >
                            {circle.change}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: '82%',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.gray900,
  },
  modalSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.gray900,
    padding: 0,
  },
  listScroll: {
    maxHeight: 380,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedCircleCard: {
    borderColor: '#0A5D36',
    backgroundColor: '#F4FBF7',
  },
  circleInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  selectedCircleName: {
    color: '#0A5D36',
  },
  updatedText: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 2,
  },
  circleInfoRight: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceCurrency: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A5D36',
    marginLeft: 2,
  },
  priceUnit: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '600',
    marginLeft: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  trendUp: {
    backgroundColor: '#FEE2E2',
  },
  trendDown: {
    backgroundColor: '#DCFCE7',
  },
  trendNeutral: {
    backgroundColor: '#F1F5F9',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
