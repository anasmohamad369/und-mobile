import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { OrderStatus } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';

interface Step {
  key: OrderStatus;
  title: string;
  time?: string;
}

const TRACKING_STEPS: Step[] = [
  { key: 'PENDING_PAYMENT', title: 'Order Placed', time: '10:32 AM' },
  { key: 'CONFIRMED', title: 'Payment & Order Confirmed', time: '10:34 AM' },
  { key: 'DRIVER_ASSIGNED', title: 'Driver Assigned', time: '10:40 AM' },
  { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', time: '11:15 AM' },
  { key: 'DELIVERED', title: 'Delivered', time: 'Pending' },
];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const getStepState = (stepKey: OrderStatus): 'completed' | 'active' | 'pending' => {
    const statusOrder: OrderStatus[] = [
      'PENDING_PAYMENT',
      'CONFIRMED',
      'DRIVER_ASSIGNED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.container}>
      {TRACKING_STEPS.map((step, index) => {
        const state = getStepState(step.key);
        const isLast = index === TRACKING_STEPS.length - 1;

        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.iconCol}>
              {state === 'completed' && <CheckCircle2 size={24} color={colors.success} />}
              {state === 'active' && <Clock size={24} color={colors.primary} />}
              {state === 'pending' && <Circle size={24} color={colors.gray300} />}

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    state === 'completed' && styles.lineCompleted,
                    state === 'active' && styles.lineActive,
                  ]}
                />
              )}
            </View>

            <View style={styles.contentCol}>
              <Text
                style={[
                  styles.stepTitle,
                  state === 'active' && styles.activeTitle,
                  state === 'completed' && styles.completedTitle,
                ]}
              >
                {step.title}
              </Text>
              <Text style={styles.stepTime}>
                {state === 'pending' ? 'Pending' : step.time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconCol: {
    alignItems: 'center',
    width: 32,
  },
  line: {
    width: 2,
    height: 36,
    backgroundColor: colors.gray200,
    marginTop: 4,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray500,
  },
  completedTitle: {
    color: colors.gray900,
    fontWeight: '700',
  },
  activeTitle: {
    color: colors.primary,
    fontWeight: '800',
  },
  stepTime: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 2,
  },
});
