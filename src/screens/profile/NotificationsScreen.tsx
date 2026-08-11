import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { useNotifications, useMarkNotificationReadMutation } from '../../hooks/useNotifications';
import { NotificationItem } from '../../types';
import { Bell, TrendingUp, Truck, CheckCircle2, Info } from 'lucide-react-native';

export const NotificationsScreen: React.FC = () => {
  const { data: notifications, isLoading, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationReadMutation();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'RATE_UPDATE':
        return <TrendingUp size={20} color={colors.accent} />;
      case 'ORDER_STATUS':
      case 'DRIVER_ASSIGNED':
        return <Truck size={20} color={colors.primary} />;
      default:
        return <Bell size={20} color={colors.info} />;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => markReadMutation.mutate(item.id)}
      >
        <Card style={[styles.card, !item.read && styles.unreadCard]}>
          <View style={styles.row}>
            <View style={styles.iconBox}>{getIcon(item.type)}</View>

            <View style={styles.infoCol}>
              <View style={styles.topTitleRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Notification Center</Text>
        <Text style={styles.screenSub}>Rate alerts, dispatch tracking, and system updates.</Text>
      </View>

      <FlatList
        data={notifications || []}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Bell size={48} color={colors.gray300} />
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
  },
  screenSub: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 10,
  },
  unreadCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  topTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  timestamp: {
    fontSize: 11,
    color: colors.gray500,
  },
  message: {
    fontSize: 13,
    color: colors.gray700,
    marginTop: 4,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray500,
    marginTop: 12,
  },
});
