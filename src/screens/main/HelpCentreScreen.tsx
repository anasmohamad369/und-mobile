import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';
import { Phone, MessageCircle, Clock, HelpCircle, ChevronRight, Headphones } from 'lucide-react-native';

export const HelpCentreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const handleCall = () => {
    Linking.openURL('tel:18006887432');
  };

  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/919876543210?text=Hello%20NutriFarm%20Support');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.headerTitle}>{t('helpTitle')}</Text>
        <Text style={styles.headerSub}>{t('helpSub')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Contact Action Cards */}
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.85} onPress={handleCall}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Phone size={24} color="#0A5D36" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('callUs')}</Text>
            <Text style={styles.actionSub}>{t('callUsSub')}</Text>
            <Text style={styles.phoneNum}>1800-NUTRIFARM (1800-688-7432)</Text>
          </View>
          <ChevronRight size={20} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} activeOpacity={0.85} onPress={handleWhatsapp}>
          <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
            <MessageCircle size={24} color="#16A34A" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('whatsappUs')}</Text>
            <Text style={styles.actionSub}>{t('whatsappUsSub')}</Text>
            <Text style={styles.phoneNum}>+91 98765 43210</Text>
          </View>
          <ChevronRight size={20} color={colors.gray400} />
        </TouchableOpacity>

        {/* Support Timing Banner */}
        <View style={styles.timingCard}>
          <Clock size={18} color="#0A5D36" style={{ marginRight: 10 }} />
          <Text style={styles.timingText}>{t('supportTiming')}</Text>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>{t('faqTitle')}</Text>

        <View style={styles.faqCard}>
          <View style={styles.faqHeaderRow}>
            <HelpCircle size={18} color="#0A5D36" style={{ marginRight: 8 }} />
            <Text style={styles.faqQuestion}>{t('faq1Q')}</Text>
          </View>
          <Text style={styles.faqAnswer}>{t('faq1A')}</Text>
        </View>

        <View style={styles.faqCard}>
          <View style={styles.faqHeaderRow}>
            <HelpCircle size={18} color="#0A5D36" style={{ marginRight: 8 }} />
            <Text style={styles.faqQuestion}>{t('faq2Q')}</Text>
          </View>
          <Text style={styles.faqAnswer}>{t('faq2A')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.gray900,
  },
  headerSub: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 4,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 85,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  actionSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  phoneNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A5D36',
    marginTop: 4,
  },
  timingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 20,
  },
  timingText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0A5D36',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.gray900,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
    marginLeft: 26,
  },
});
