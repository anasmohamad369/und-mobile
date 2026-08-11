import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';
import { Driver } from '../../types';
import { Phone, UserCheck, ShieldCheck } from 'lucide-react-native';

interface DriverCardProps {
  driver?: Driver;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  if (!driver) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${driver.mobile}`);
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.headerTitle}>Your Delivery Partner</Text>

      <View style={styles.driverRow}>
        <View style={styles.avatar}>
          <UserCheck size={24} color={colors.primary} />
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.vehicleText}>Vehicle: {driver.vehicleNumber}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>On the way</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callBtn} activeOpacity={0.8} onPress={handleCall}>
          <Phone size={18} color={colors.textWhite} style={{ marginRight: 6 }} />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.securityNote}>
        <ShieldCheck size={14} color={colors.gray500} style={{ marginRight: 6 }} />
        <Text style={styles.securityText}>Verified Platform Logistics Partner</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.gray900,
  },
  vehicleText: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  callBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  securityText: {
    fontSize: 12,
    color: colors.gray500,
  },
});
