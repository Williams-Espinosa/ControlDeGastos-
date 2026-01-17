import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';
import { Budget } from '@/context/BudgetContext';

const NOTIFICATION_SETTINGS_KEY = '@expense_tracker_notifications';

// Configure notification handling
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    
    return finalStatus === 'granted';
};

export const sendBudgetAlert = async (
    category: string, 
    spending: number, 
    limit: number,
    type: 'warning' | 'danger'
): Promise<void> => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const percentage = Math.round((spending / limit) * 100);
    
    const title = type === 'danger' 
        ? '🚨 ¡Presupuesto Excedido!' 
        : '⚠️ Alerta de Presupuesto';
    
    const body = type === 'danger'
        ? `Ya sobrepasaste los $${limit.toFixed(2)} para ${category}. Gastaste $${spending.toFixed(2)}`
        : `Cuidado! Llevas ${percentage}% ($${spending.toFixed(2)}) de tu presupuesto de $${limit.toFixed(2)} para ${category}`;

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
    });
};

export const checkBudgetAlerts = async (
    expenses: Expense[],
    budgets: Budget[]
): Promise<void> => {
    const sentNotifications = await getSentNotifications();
    const today = new Date().toISOString().slice(0, 10);

    for (const budget of budgets) {
        const categorySpending = expenses
            .filter(e => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const percentage = (categorySpending / budget.limit) * 100;
        const notificationKey = `${budget.id}_${today}_${percentage >= 100 ? 'danger' : 'warning'}`;

        // Only send notification if we haven't sent one today for this budget/level
        if (!sentNotifications.includes(notificationKey)) {
            if (percentage >= 100) {
                await sendBudgetAlert(budget.category, categorySpending, budget.limit, 'danger');
                await markNotificationSent(notificationKey);
            } else if (percentage >= 80) {
                await sendBudgetAlert(budget.category, categorySpending, budget.limit, 'warning');
                await markNotificationSent(notificationKey);
            }
        }
    }
};

const getSentNotifications = async (): Promise<string[]> => {
    try {
        const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const markNotificationSent = async (key: string): Promise<void> => {
    try {
        const existing = await getSentNotifications();
        existing.push(key);
        // Keep only last 100 entries
        const trimmed = existing.slice(-100);
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Error saving notification state:', error);
    }
};

export const sendTestNotification = async (): Promise<void> => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        throw new Error('Permission not granted');
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🔔 Notificación de Prueba',
            body: 'Las notificaciones están funcionando correctamente!',
            sound: true,
        },
        trigger: null,
    });
};
