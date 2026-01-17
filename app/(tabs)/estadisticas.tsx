import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useTheme } from '@/context/ThemeContext';
import { TopBar } from '@/components/ui/TopBar';
import { PieChartComponent, BarChartComponent, LineChartComponent } from '@/components/charts';
import { generatePDF, generateCSV } from '@/services/export.service';
import { Ionicons } from '@expo/vector-icons';

export default function EstadisticasScreen() {
    const { expenses, isLoading } = useExpenses();
    const { colors } = useTheme();
    const [exporting, setExporting] = useState(false);
    
    const styles = makeStyles(colors);

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

    // Group by category
    const byCategory = expenses.reduce((acc, expense) => {
        const cat = expense.category;
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

    // Pie chart data
    const pieData = categories.map(([name, amount]) => ({
        name: name.slice(0, 10),
        amount,
        color: '',
        legendFontColor: colors.textMuted,
        legendFontSize: 12,
    }));

    // Bar chart data
    const barLabels = categories.map(([name]) => name.replace(/[^\w\s]/g, '').slice(0, 6));
    const barData = categories.map(([, amount]) => amount);

    // Line chart - last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().slice(0, 10);
    });

    const lineLabels = last7Days.map(d => d.slice(5));
    const lineData = last7Days.map(date => 
        expenses
            .filter(e => e.date === date)
            .reduce((sum, e) => sum + e.amount, 0)
    );

    const handleExportPDF = async () => {
        if (expenses.length === 0) {
            Alert.alert('Sin datos', 'No hay gastos para exportar');
            return;
        }
        setExporting(true);
        try {
            await generatePDF(expenses);
        } catch (error) {
            Alert.alert('Error', 'No se pudo generar el PDF');
        } finally {
            setExporting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar title="Estadísticas" />
            
            <ScrollView style={styles.content}>
                {/* Export Buttons */}
                <View style={styles.exportRow}>
                    <Pressable 
                        style={[styles.exportButton, styles.pdfButton]} 
                        onPress={handleExportPDF}
                        disabled={exporting}
                    >
                        <Ionicons name="document-text" size={20} color="#fff" />
                        <Text style={styles.exportButtonText}>Exportar PDF</Text>
                    </Pressable>
                </View>

                {exporting && (
                    <View style={styles.exportingOverlay}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={styles.exportingText}>Generando archivo...</Text>
                    </View>
                )}

                {/* Summary Cards */}
                <Text style={styles.sectionTitle}>📊 Resumen General</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Gastado</Text>
                        <Text style={styles.statValue}>${totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Promedio</Text>
                        <Text style={styles.statValue}>${averageAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Categorías</Text>
                        <Text style={styles.statValue}>{categories.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Gastos</Text>
                        <Text style={styles.statValue}>{expenses.length}</Text>
                    </View>
                </View>

                {expenses.length > 0 && (
                    <>
                        {/* Pie Chart */}
                        <Text style={styles.sectionTitle}>🥧 Por Categoría</Text>
                        <View style={styles.chartCard}>
                            <PieChartComponent data={pieData} />
                        </View>

                        {/* Bar Chart */}
                        <Text style={styles.sectionTitle}>📊 Comparación</Text>
                        <View style={styles.chartCard}>
                            <BarChartComponent labels={barLabels} data={barData} />
                        </View>

                        {/* Line Chart */}
                        <Text style={styles.sectionTitle}>📈 Últimos 7 Días</Text>
                        <View style={styles.chartCard}>
                            <LineChartComponent labels={lineLabels} data={lineData} />
                        </View>
                    </>
                )}

                {expenses.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyText}>No hay datos para mostrar</Text>
                        <Text style={styles.emptySubtext}>Agrega gastos para ver estadísticas</Text>
                    </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    exportRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    exportButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 12,
    },
    pdfButton: {
        backgroundColor: '#ef4444',
    },
    csvButton: {
        backgroundColor: '#22c55e',
    },
    exportButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    exportingOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: colors.card,
        borderRadius: 8,
        marginBottom: 16,
    },
    exportingText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
        marginTop: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
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
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
    },
    chartCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
