import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { TopBar } from '@/components/ui/TopBar';
import { useBudgetContext } from '@/context/BudgetContext';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default function PresupuestosScreen() {
    const { budgets, addBudget, removeBudget } = useBudgetContext();
    const { colors } = useTheme();
    const [showAddForm, setShowAddForm] = useState(false);
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [period, setPeriod] = useState<'semanal' | 'mensual'>('semanal');

    const styles = makeStyles(colors);

    const categories = ['🍔 Comida', '🚗 Transporte', '🏠 Hogar', '🎮 Entretenimiento', '💊 Salud', '📚 Educación', '👕 Ropa', '💼 Otros'];

    const handleAddBudget = () => {
        if (!category || !limit) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        addBudget({
            id: uuidv4(),
            category,
            limit: Number(limit),
            period,
        });

        setCategory('');
        setLimit('');
        setShowAddForm(false);
    };

    const handleRemove = (id: string) => {
        Alert.alert(
            'Eliminar presupuesto',
            '¿Seguro que deseas eliminar este presupuesto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => removeBudget(id) },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TopBar title="Presupuestos" />
            
            <ScrollView style={styles.content}>
                <Text style={styles.description}>
                    Establece límites de gasto para cada categoría. Recibirás notificaciones cuando te acerques o sobrepases estos límites.
                </Text>

                {budgets.map((budget) => (
                    <View key={budget.id} style={styles.budgetCard}>
                        <View style={styles.budgetHeader}>
                            <View>
                                <Text style={styles.budgetCategory}>{budget.category}</Text>
                                <Text style={styles.budgetPeriod}>{budget.period}</Text>
                            </View>
                            <View style={styles.budgetRight}>
                                <Text style={styles.budgetLimit}>${budget.limit.toFixed(2)}</Text>
                                <Pressable onPress={() => handleRemove(budget.id)}>
                                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}

                {budgets.length === 0 && !showAddForm && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💰</Text>
                        <Text style={styles.emptyText}>No hay presupuestos configurados</Text>
                    </View>
                )}

                {!showAddForm ? (
                    <Pressable style={styles.addButton} onPress={() => setShowAddForm(true)}>
                        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                        <Text style={styles.addButtonText}>Agregar Presupuesto</Text>
                    </Pressable>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>Nuevo Presupuesto</Text>

                        <View style={styles.categoryContainer}>
                            <Text style={styles.label}>Categoría</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat) => (
                                    <Pressable
                                        key={cat}
                                        style={[
                                            styles.categoryChip,
                                            category === cat && styles.categoryChipSelected
                                        ]}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text style={[
                                            styles.categoryChipText,
                                            category === cat && styles.categoryChipTextSelected
                                        ]}>
                                            {cat}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <Text style={styles.label}>Límite de Gasto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 100"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="numeric"
                            value={limit}
                            onChangeText={setLimit}
                        />

                        <Text style={styles.label}>Período</Text>
                        <View style={styles.periodContainer}>
                            <Pressable
                                style={[
                                    styles.periodButton,
                                    period === 'semanal' && styles.periodButtonActive
                                ]}
                                onPress={() => setPeriod('semanal')}
                            >
                                <Text style={[
                                    styles.periodButtonText,
                                    period === 'semanal' && styles.periodButtonTextActive
                                ]}>
                                    Semanal
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.periodButton,
                                    period === 'mensual' && styles.periodButtonActive
                                ]}
                                onPress={() => setPeriod('mensual')}
                            >
                                <Text style={[
                                    styles.periodButtonText,
                                    period === 'mensual' && styles.periodButtonTextActive
                                ]}>
                                    Mensual
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.formButtons}>
                            <Pressable
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setShowAddForm(false);
                                    setCategory('');
                                    setLimit('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.saveButton]}
                                onPress={handleAddBudget}
                            >
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </Pressable>
                        </View>
                    </View>
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
    content: {
        flex: 1,
        padding: 16,
    },
    description: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 20,
        lineHeight: 20,
    },
    budgetCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    budgetCategory: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    budgetPeriod: {
        fontSize: 12,
        color: colors.textMuted,
        textTransform: 'capitalize',
    },
    budgetRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    budgetLimit: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
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
        fontSize: 16,
        fontWeight: '600',
        color: colors.textMuted,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.primary,
        marginTop: 16,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    form: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 16,
        marginTop: 16,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: colors.background,
        padding: 14,
        borderRadius: 12,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    categoryContainer: {
        marginBottom: 12,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    categoryChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    categoryChipText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    categoryChipTextSelected: {
        color: '#fff',
    },
    periodContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    periodButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.primary + '30',
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    periodButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textMuted,
    },
    periodButtonTextActive: {
        color: '#fff',
    },
    formButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.textMuted,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textMuted,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
