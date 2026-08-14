import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { colors } from '../../theme/colors';
import { Globe, CheckCircle2, Circle, X } from 'lucide-react-native';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleBox}>
                  <View style={styles.globeCircle}>
                    <Globe size={20} color="#0A5D36" />
                  </View>
                  <Text style={styles.title}>{t('selectLanguage')}</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                  <X size={18} color={colors.gray600} />
                </TouchableOpacity>
              </View>

              {/* Language Options */}
              <View style={styles.optionsList}>
                {/* English Option */}
                <TouchableOpacity
                  style={[
                    styles.langCard,
                    language === 'en' && styles.selectedLangCard,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelectLanguage('en')}
                >
                  <View style={styles.radioBox}>
                    {language === 'en' ? (
                      <CheckCircle2 size={22} color="#0A5D36" />
                    ) : (
                      <Circle size={22} color={colors.gray300} />
                    )}
                  </View>
                  <View>
                    <Text style={[styles.langTitle, language === 'en' && styles.selectedLangTitle]}>
                      English
                    </Text>
                    <Text style={styles.langSub}>Default (English)</Text>
                  </View>
                </TouchableOpacity>

                {/* Telugu Option */}
                <TouchableOpacity
                  style={[
                    styles.langCard,
                    language === 'te' && styles.selectedLangCard,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelectLanguage('te')}
                >
                  <View style={styles.radioBox}>
                    {language === 'te' ? (
                      <CheckCircle2 size={22} color="#0A5D36" />
                    ) : (
                      <Circle size={22} color={colors.gray300} />
                    )}
                  </View>
                  <View>
                    <Text style={[styles.langTitle, language === 'te' && styles.selectedLangTitle]}>
                      తెలుగు (Telugu)
                    </Text>
                    <Text style={styles.langSub}>తెలుగు భాషలో యాప్‌ని ఉపయోగించండి</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
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
  globeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.gray900,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 10,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  selectedLangCard: {
    borderColor: '#0A5D36',
    backgroundColor: '#F4FBF7',
  },
  radioBox: {
    marginRight: 12,
  },
  langTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  selectedLangTitle: {
    color: '#0A5D36',
  },
  langSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
});
