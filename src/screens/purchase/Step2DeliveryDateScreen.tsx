import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react-native';

interface Step2DeliveryDateScreenProps {
  initialDate?: string;
  onContinue: (deliveryDate: string) => void;
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Sample August 2025 calendar days (1-31)
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const Step2DeliveryDateScreen: React.FC<Step2DeliveryDateScreenProps> = ({
  initialDate = '10 Aug 2025 (Sunday)',
  onContinue,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(10);

  const selectedDateFormatted = `${selectedDay} Aug 2025 (${
    selectedDay === 10 ? 'Sunday' : selectedDay === 11 ? 'Monday' : selectedDay === 12 ? 'Tuesday' : 'Wednesday'
  })`;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Select Delivery Date</Text>
        <Text style={styles.subheading}>Choose your preferred delivery date</Text>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Month Header */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>August 2025</Text>
            <View style={styles.monthNav}>
              <TouchableOpacity style={styles.navBtn}>
                <ChevronLeft size={18} color={colors.gray700} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <ChevronRight size={18} color={colors.gray700} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Days of week header */}
          <View style={styles.daysHeaderRow}>
            {DAYS_OF_WEEK.map((day) => (
              <Text key={day} style={styles.dayHeaderCell}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.gridContainer}>
            {/* Aug 1 starts on Friday (offset 5 empty cells) */}
            <View style={styles.emptyCell} />
            <View style={styles.emptyCell} />
            <View style={styles.emptyCell} />
            <View style={styles.emptyCell} />
            <View style={styles.emptyCell} />

            {CALENDAR_DAYS.map((d) => {
              const isSelected = d === selectedDay;
              const isPast = d < 10;
              return (
                <TouchableOpacity
                  key={d}
                  disabled={isPast}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDayCell,
                    isPast && styles.disabledDayCell,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(d)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isPast && styles.disabledDayText,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Date Preview Box */}
          <View style={styles.selectedPreviewBox}>
            <CalendarIcon size={18} color="#0A5D36" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.previewLabel}>Selected Date</Text>
              <Text style={styles.previewVal}>{selectedDateFormatted}</Text>
            </View>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.checkCircle}>
            <Check size={14} color="#0A5D36" />
          </View>
          <Text style={styles.infoText}>
            Orders placed before 6:00 PM will be delivered on the selected date.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.88}
          onPress={() => onContinue(selectedDateFormatted)}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.gray900,
    marginTop: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 4,
    marginBottom: 16,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  monthNav: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayHeaderCell: {
    width: 38,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: colors.gray400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyCell: {
    width: '14.28%',
    height: 38,
  },
  dayCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: '#0A5D36',
    borderRadius: 19,
  },
  disabledDayCell: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  disabledDayText: {
    color: colors.gray400,
  },
  selectedPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
  },
  previewVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0A5D36',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueBtn: {
    backgroundColor: '#0A5D36',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A5D36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
