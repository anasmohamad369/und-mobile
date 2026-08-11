import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { useAuthContext } from '../../context/AuthContext';
import {
  User,
  Building2,
  Store,
  CalendarRange,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

interface ProfileScreenProps {
  onEditProfile: () => void;
  onManageShops: () => void;
  onViewRequirements: () => void;
  onViewNotifications: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onEditProfile,
  onManageShops,
  onViewRequirements,
  onViewNotifications,
}) => {
  const { retailer, logout } = useAuthContext();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out of your retailer account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatarCircle}>
          <Building2 size={36} color={colors.primary} />
        </View>

        <Text style={styles.businessTitle}>
          {retailer?.businessName || 'ABC Chicken Traders'}
        </Text>
        <Text style={styles.ownerName}>
          Owner: {retailer?.ownerName || 'Mohammed'}
        </Text>

        <View style={styles.verifiedTag}>
          <ShieldCheck size={14} color={colors.success} style={{ marginRight: 4 }} />
          <Text style={styles.verifiedTagText}>
            Verified Mobile: +91 {retailer?.mobile || '9876543210'}
          </Text>
        </View>
      </View>

      {/* Profile Info Details */}
      <Card style={styles.infoCard}>
        <Text style={styles.sectionHeader}>Business Overview</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>GST / Tax No:</Text>
          <Text style={styles.infoVal}>{retailer?.gstNumber || '24ABCDE1234F1Z5'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoVal}>{retailer?.email || 'abc@example.com'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoVal}>{retailer?.city}, {retailer?.state}</Text>
        </View>
      </Card>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onEditProfile}>
          <View style={styles.menuIconBox}>
            <User size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Edit Business Profile</Text>
          <ChevronRight size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onManageShops}>
          <View style={styles.menuIconBox}>
            <Store size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Manage Shops & Addresses</Text>
          <ChevronRight size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onViewRequirements}>
          <View style={styles.menuIconBox}>
            <CalendarRange size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Expected KG Requirements</Text>
          <ChevronRight size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onViewNotifications}>
          <View style={styles.menuIconBox}>
            <Bell size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Notifications & Rate Alerts</Text>
          <ChevronRight size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => Alert.alert('Support', 'Call customer support at 1800-POULTRY or email support@chickencommerce.com')}>
          <View style={styles.menuIconBox}>
            <HelpCircle size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuTitle}>Help & Wholesale Support</Text>
          <ChevronRight size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} activeOpacity={0.7} onPress={handleLogout}>
          <View style={[styles.menuIconBox, styles.logoutIconBox]}>
            <LogOut size={20} color={colors.danger} />
          </View>
          <Text style={[styles.menuTitle, styles.logoutTitle]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  businessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
  },
  ownerName: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 2,
    fontWeight: '600',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 10,
  },
  verifiedTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  infoCard: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray500,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray800,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutIconBox: {
    backgroundColor: colors.dangerLight,
  },
  logoutTitle: {
    color: colors.danger,
  },
});
