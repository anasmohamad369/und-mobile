import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useRequirements } from '../../hooks/useRequirements';
import { Requirement } from '../../types';
import { CalendarRange, Plus, TrendingUp } from 'lucide-react-native';

interface RequirementsListScreenProps {
  onAddRequirement: () => void;
}

export const RequirementsListScreen: React.FC<RequirementsListScreenProps> = ({
  onAddRequirement,
}) => {
  const { data: requirements, isLoading, refetch } = useRequirements();

  const renderRequirementItem = ({ item }: { item: Requirement }) => {
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.shopNameBox}>
            <CalendarRange size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.shopName}>{item.shopName}</Text>
          </View>
          <Badge label={item.status} variant="warning" />
        </View>

        <View style={styles.kgRow}>
          <View style={styles.kgBlock}>
            <Text style={styles.kgLabel}>Expected</Text>
            <Text style={styles.kgValue}>{item.expectedKg.toLocaleString()} KG</Text>
          </View>

          <View style={styles.kgBlock}>
            <Text style={styles.kgLabel}>Purchased</Text>
            <Text style={styles.kgValue}>{item.purchasedKg || 0} KG</Text>
          </View>

          <View style={styles.kgBlock}>
            <Text style={styles.kgLabel}>Remaining</Text>
            <Text style={styles.remainingValue}>{item.remainingKg || item.expectedKg} KG</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <Text style={styles.dateRangeText}>
            Period: {item.fromDate} to {item.toDate}
          </Text>
        </View>

        {item.notes ? <Text style={styles.notesText}>Note: "{item.notes}"</Text> : null}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expected Requirements</Text>
        <Text style={styles.subtitle}>
          Future demand forecast signals submitted for your shops.
        </Text>
      </View>

      <FlatList
        data={requirements || []}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRequirementItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      />

      <View style={styles.footer}>
        <Button
          title="+ Add Expected Requirement"
          variant="primary"
          size="lg"
          icon={<Plus size={20} color={colors.textWhite} />}
          onPress={onAddRequirement}
        />
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shopNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  kgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 12,
  },
  kgBlock: {
    alignItems: 'flex-start',
  },
  kgLabel: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: '600',
  },
  kgValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray800,
    marginTop: 2,
  },
  remainingValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.gray500,
    marginTop: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
