import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useTheme } from '@/context/ThemeContext';
import { TopBar } from '@/components/ui/TopBar';

export default function HomeScreen() {
    const { expenses, isLoading } = useExpenses();
    const { colors } = useTheme();
    const styles = makeStyles(colors);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Cargando gastos...</Text>
            </View>
        );
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <View style={styles.container}>
            <TopBar title="Inicio" />

            {/* Statistics Cards */}
            <View style={styles.statsSection}>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total de Gastos</Text>
                        <Text style={styles.statValue}>{expenses.length}</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Suma Total</Text>
                        <Text style={styles.statValueAmount}>${totalAmount.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Content Area */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {expenses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyTitle}>No hay gastos registrados</Text>
                        <Text style={styles.emptyDescription}>
                            Presiona el botón + en la barra inferior para agregar tu primer gasto
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
                        <ExpenseList expenses={expenses} />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 12,
        color: colors.textMuted,
        fontSize: 16,
    },
    statsSection: {
        padding: 16,
        paddingTop: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    statLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 6,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.primary,
    },
    statValueAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.secondary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
        marginTop: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 24,
    },
});
