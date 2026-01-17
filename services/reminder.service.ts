import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';

const REMINDER_SETTINGS_KEY = '@expense_tracker_reminder_settings';
const LAST_REMINDER_KEY = '@expense_tracker_last_reminders';

export interface ReminderSettings {
    dailyReminder: boolean;
    weeklyReminder: boolean;
    smartReminders: boolean;
    reminderTime: string; // HH:MM format
}

interface LastReminders {
    noExpenseToday: string | null;
    weeklySummary: string | null;
    spendingComparison: string | null;
}

const defaultSettings: ReminderSettings = {
    dailyReminder: true,
    weeklyReminder: true,
    smartReminders: true,
    reminderTime: '20:00',
};

// Get reminder settings
export const getReminderSettings = async (): Promise<ReminderSettings> => {
    try {
        const stored = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
        return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

// Save reminder settings
export const saveReminderSettings = async (settings: ReminderSettings): Promise<void> => {
    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
};

// Track last sent reminders to avoid duplicates
const getLastReminders = async (): Promise<LastReminders> => {
    try {
        const stored = await AsyncStorage.getItem(LAST_REMINDER_KEY);
        return stored ? JSON.parse(stored) : { noExpenseToday: null, weeklySummary: null, spendingComparison: null };
    } catch {
        return { noExpenseToday: null, weeklySummary: null, spendingComparison: null };
    }
};

const saveLastReminder = async (type: keyof LastReminders): Promise<void> => {
    const last = await getLastReminders();
    last[type] = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(LAST_REMINDER_KEY, JSON.stringify(last));
};

// Check if expenses were registered today
export const checkDailyActivity = async (expenses: Expense[]): Promise<void> => {
    const settings = await getReminderSettings();
    if (!settings.dailyReminder) return;

    const today = new Date().toISOString().slice(0, 10);
    const lastReminders = await getLastReminders();
    
    // Don't send if already sent today
    if (lastReminders.noExpenseToday === today) return;

    const todayExpenses = expenses.filter(e => e.date === today);
    
    // Check if it's evening (after 8 PM) and no expenses today
    const currentHour = new Date().getHours();
    if (currentHour >= 20 && todayExpenses.length === 0) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🕗 ¿Olvidaste registrar gastos?',
                body: 'No has registrado ningún gasto hoy. ¿Todo bien?',
                sound: true,
            },
            trigger: null,
        });
        await saveLastReminder('noExpenseToday');
    }
};

// Generate weekly summary
export const generateWeeklySummary = async (expenses: Expense[]): Promise<void> => {
    const settings = await getReminderSettings();
    if (!settings.weeklyReminder) return;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayStr = today.toISOString().slice(0, 10);
    const lastReminders = await getLastReminders();

    // Only on Sundays and if not already sent today
    if (dayOfWeek !== 0 || lastReminders.weeklySummary === todayStr) return;

    // Calculate this week's spending
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    
    const thisWeekExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= weekStart && expenseDate <= today;
    });

    const totalSpent = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = thisWeekExpenses.length;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '📅 Resumen Semanal Listo',
            body: `Esta semana: ${count} gastos por $${totalSpent.toFixed(2)}. ¡Revisa tus estadísticas!`,
            sound: true,
        },
        trigger: null,
    });
    await saveLastReminder('weeklySummary');
};

// Compare spending with previous week
export const compareWithLastWeek = async (expenses: Expense[]): Promise<void> => {
    const settings = await getReminderSettings();
    if (!settings.smartReminders) return;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const lastReminders = await getLastReminders();

    // Only check once per day
    if (lastReminders.spendingComparison === todayStr) return;

    // This week's dates
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7);
    
    // Last week's dates
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekTotal = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d >= thisWeekStart && d <= today;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    const lastWeekTotal = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d >= lastWeekStart && d < thisWeekStart;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    // Only notify if significant difference
    if (lastWeekTotal === 0) return;

    const percentChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

    if (percentChange > 20) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '📈 Gastaste más que la semana pasada',
                body: `Esta semana: $${thisWeekTotal.toFixed(2)} vs $${lastWeekTotal.toFixed(2)} semana pasada (+${percentChange.toFixed(0)}%)`,
                sound: true,
            },
            trigger: null,
        });
        await saveLastReminder('spendingComparison');
    } else if (percentChange < -20) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '📉 ¡Excelente! Gastaste menos esta semana',
                body: `Esta semana: $${thisWeekTotal.toFixed(2)} vs $${lastWeekTotal.toFixed(2)} semana pasada (${percentChange.toFixed(0)}%)`,
                sound: true,
            },
            trigger: null,
        });
        await saveLastReminder('spendingComparison');
    }
};

// Run all smart reminder checks
export const runSmartReminders = async (expenses: Expense[]): Promise<void> => {
    try {
        await checkDailyActivity(expenses);
        await generateWeeklySummary(expenses);
        await compareWithLastWeek(expenses);
    } catch (error) {
        console.error('Error running smart reminders:', error);
    }
};

// Schedule daily reminder notification
export const scheduleDailyReminder = async (): Promise<void> => {
    const settings = await getReminderSettings();
    if (!settings.dailyReminder) return;

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💰 Tiempo de registrar gastos',
            body: '¿Hiciste algún gasto hoy? No olvides registrarlo.',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hours,
            minute: minutes,
        },
    });
};

// Get smart insights based on spending patterns
export const getSpendingInsights = (expenses: Expense[]): string[] => {
    const insights: string[] = [];
    
    if (expenses.length === 0) {
        insights.push('💡 Comienza a registrar gastos para obtener insights personalizados');
        return insights;
    }

    // Average daily spending
    const dates = [...new Set(expenses.map(e => e.date))];
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgDaily = dates.length > 0 ? totalSpent / dates.length : 0;
    insights.push(`📊 Promedio diario: $${avgDaily.toFixed(2)}`);

    // Top category
    const byCategory: Record<string, number> = {};
    expenses.forEach(e => {
        byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
        insights.push(`🏆 Mayor gasto: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`);
    }

    // Most frequent category
    const countByCategory: Record<string, number> = {};
    expenses.forEach(e => {
        countByCategory[e.category] = (countByCategory[e.category] || 0) + 1;
    });
    const mostFrequent = Object.entries(countByCategory).sort((a, b) => b[1] - a[1])[0];
    if (mostFrequent) {
        insights.push(`🔄 Categoría más frecuente: ${mostFrequent[0]} (${mostFrequent[1]} veces)`);
    }

    return insights;
};
