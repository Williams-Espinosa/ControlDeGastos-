import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useBudgetContext } from '@/context/BudgetContext';
import { useTheme } from '@/context/ThemeContext';
import { TopBar } from '@/components/ui/TopBar';
import { Ionicons } from '@expo/vector-icons';
import { sendTestNotification, checkBudgetAlerts } from '@/services/notification.service';
import { 
    runSmartReminders, 
    getSpendingInsights, 
    getReminderSettings, 
    saveReminderSettings,
    ReminderSettings,
    scheduleDailyReminder
} from '@/services/reminder.service';

export default function NotificacionesScreen() {
    const { expenses } = useExpenses();
    const { budgets } = useBudgetContext();
    const { colors } = useTheme();
    const [sendingTest, setSendingTest] = useState(false);
    const [settings, setSettings] = useState<ReminderSettings>({
        dailyReminder: true,
        weeklyReminder: true,
        smartReminders: true,
        reminderTime: '20:00',
    });

    const styles = makeStyles(colors);

    const insights = getSpendingInsights(expenses);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const saved = await getReminderSettings();
        setSettings(saved);
    };

    const updateSetting = async (key: keyof ReminderSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await saveReminderSettings(newSettings);
        
        if (key === 'dailyReminder' && value) {
            await scheduleDailyReminder();
        }
    };

    // Calculate current spending per category
    const getSpendingByCategory = (category: string) => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
    };

    // Generate notifications based on budget limits
    const notifications = budgets.map(budget => {
        const spending = getSpendingByCategory(budget.category);
        const percentage = (spending / budget.limit) * 100;
        
        let type: 'warning' | 'danger' | 'info' = 'info';
        let message = '';
        let icon: any = 'information-circle';

        if (spending >= budget.limit) {
            type = 'danger';
            message = `¡Ya sobrepasaste los $${budget.limit.toFixed(2)} para ${budget.category} ${budget.period}!`;
            icon = 'alert-circle';
        } else if (percentage >= 80) {
            type = 'warning';
            message = `Cuidado! Ya gastaste el ${percentage.toFixed(0)}% de tu presupuesto ${budget.period} para ${budget.category}`;
            icon = 'warning';
        } else if (percentage >= 50) {
            type = 'info';
            message = `Llevas $${spending.toFixed(2)} de $${budget.limit.toFixed(2)} en ${budget.category} (${percentage.toFixed(0)}%)`;
            icon = 'information-circle';
        }

        return message ? {
            id: budget.id,
            type,
            message,
            icon,
            category: budget.category,
            spending,
            limit: budget.limit,
            percentage,
        } : null;
    }).filter(n => n !== null);

    const handleTestNotification = async () => {
        setSendingTest(true);
        try {
            await sendTestNotification();
            Alert.alert('✅ Éxito', 'Notificación enviada! Revisa tu centro de notificaciones.');
        } catch (error) {
            Alert.alert('❌ Error', 'No se pudo enviar la notificación. Verifica los permisos.');
        } finally {
            setSendingTest(false);
        }
    };

    const handleRunSmartReminders = async () => {
        try {
            await runSmartReminders(expenses);
            Alert.alert('✅ Listo', 'Recordatorios inteligentes verificados.');
        } catch (error) {
            Alert.alert('❌ Error', 'No se pudieron verificar los recordatorios.');
        }
    };

    const handleCheckAlerts = async () => {
        try {
            await checkBudgetAlerts(expenses, budgets);
            Alert.alert('✅ Listo', 'Se verificaron todas las alertas de presupuesto.');
        } catch (error) {
            Alert.alert('❌ Error', 'No se pudieron verificar las alertas.');
        }
    };

    return (
        <View style={styles.container}>
            <TopBar title="Notificaciones" showTime={false} />
            
            <ScrollView style={styles.content}>
                {/* Smart Insights */}
                <View style={styles.insightsCard}>
                    <Text style={styles.insightsTitle}>💡 Insights Inteligentes</Text>
                    {insights.map((insight, index) => (
                        <Text key={index} style={styles.insightItem}>{insight}</Text>
                    ))}
                </View>

                {/* Reminder Settings */}
                <Text style={styles.sectionTitle}>⚙️ Configuración</Text>
                <View style={styles.settingsCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>🕗 Recordatorio diario</Text>
                            <Text style={styles.settingDesc}>
                                "No has registrado gastos hoy"
                            </Text>
                        </View>
                        <Switch
                            value={settings.dailyReminder}
                            onValueChange={(v) => updateSetting('dailyReminder', v)}
                            trackColor={{ false: colors.background, true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>📅 Resumen semanal</Text>
                            <Text style={styles.settingDesc}>
                                "Resumen semanal listo" (domingos)
                            </Text>
                        </View>
                        <Switch
                            value={settings.weeklyReminder}
                            onValueChange={(v) => updateSetting('weeklyReminder', v)}
                            trackColor={{ false: colors.background, true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>📉 Comparación de gastos</Text>
                            <Text style={styles.settingDesc}>
                                "Gastaste más/menos que la semana pasada"
                            </Text>
                        </View>
                        <Switch
                            value={settings.smartReminders}
                            onValueChange={(v) => updateSetting('smartReminders', v)}
                            trackColor={{ false: colors.background, true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <Text style={styles.sectionTitle}>🔔 Acciones</Text>
                <View style={styles.actionGrid}>
                    <Pressable 
                        style={[styles.actionButton, styles.testButton]} 
                        onPress={handleTestNotification}
                        disabled={sendingTest}
                    >
                        <Ionicons name="notifications" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>
                            {sendingTest ? 'Enviando...' : 'Probar Push'}
                        </Text>
                    </Pressable>
                    
                    <Pressable 
                        style={[styles.actionButton, styles.smartButton]} 
                        onPress={handleRunSmartReminders}
                    >
                        <Ionicons name="bulb" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Recordatorios</Text>
                    </Pressable>
                    
                    <Pressable 
                        style={[styles.actionButton, styles.checkButton]} 
                        onPress={handleCheckAlerts}
                    >
                        <Ionicons name="wallet" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Presupuestos</Text>
                    </Pressable>
                </View>

                {/* Budget Alerts */}
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={60} color={colors.secondary} />
                        <Text style={styles.emptyTitle}>Todo bajo control</Text>
                        <Text style={styles.emptyText}>
                            {budgets.length === 0 
                                ? 'Configura presupuestos para recibir alertas inteligentes'
                                : 'No hay alertas de presupuesto por ahora 🎉'
                            }
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>⚠️ Alertas de Presupuesto</Text>
                        {notifications.map((notification) => (
                            <View 
                                key={notification.id} 
                                style={[
                                    styles.notificationCard,
                                    notification.type === 'danger' && styles.notificationDanger,
                                    notification.type === 'warning' && styles.notificationWarning,
                                ]}
                            >
                                <View style={styles.notificationIcon}>
                                    <Ionicons 
                                        name={notification.icon} 
                                        size={24} 
                                        color={
                                            notification.type === 'danger' ? colors.danger :
                                            notification.type === 'warning' ? '#f59e0b' :
                                            colors.primary
                                        } 
                                    />
                                </View>
                                <View style={styles.notificationContent}>
                                    <Text style={styles.notificationMessage}>
                                        {notification.message}
                                    </Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBar}>
                                            <View 
                                                style={[
                                                    styles.progressFill,
                                                    { width: `${Math.min(notification.percentage, 100)}%` },
                                                    notification.type === 'danger' && styles.progressDanger,
                                                    notification.type === 'warning' && styles.progressWarning,
                                                ]} 
                                            />
                                        </View>
                                        <Text style={styles.progressText}>
                                            ${notification.spending.toFixed(2)} / ${notification.limit.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    insightsCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    insightsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    insightItem: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 6,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    settingsCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    settingInfo: {
        flex: 1,
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 12,
        color: colors.textMuted,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 16,
        borderRadius: 12,
    },
    testButton: {
        backgroundColor: colors.primary,
    },
    smartButton: {
        backgroundColor: '#8b5cf6',
    },
    checkButton: {
        backgroundColor: colors.secondary,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
    },
    notificationCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    notificationWarning: {
        borderLeftColor: '#f59e0b',
    },
    notificationDanger: {
        borderLeftColor: colors.danger,
    },
    notificationIcon: {
        marginTop: 2,
    },
    notificationContent: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 15,
        color: colors.text,
        marginBottom: 12,
        lineHeight: 22,
    },
    progressBarContainer: {
        gap: 6,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    progressWarning: {
        backgroundColor: '#f59e0b',
    },
    progressDanger: {
        backgroundColor: colors.danger,
    },
    progressText: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '600',
    },
});
