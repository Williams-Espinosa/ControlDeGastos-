import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { colors } from '@/styles/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { expenses, removeExpense } = useExpenses();

    const expense = expenses.find((e) => e.id === id);

    if (!expense) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Gasto no encontrado</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Eliminar gasto',
            '¿Seguro que deseas eliminar este gasto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        removeExpense(expense.id);
                        router.replace('/');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Detalle del Gasto</Text>
                <Pressable onPress={() => router.push(`/edit-expense/${expense.id}`)} style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color={colors.primary} />
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>{expense.title}</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Monto</Text>
                    <Text style={styles.value}>${expense.amount.toFixed(2)}</Text>

                    <Text style={styles.label}>Categoría</Text>
                    <Text style={styles.value}>{expense.category}</Text>

                    <Text style={styles.label}>Fecha</Text>
                    <Text style={styles.value}>{expense.date}</Text>
                </View>

                {expense.imageUri && (
                    <Image source={{ uri: expense.imageUri }} style={styles.image} />
                )}

                <Pressable style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteText}>Eliminar gasto</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: colors.card,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        padding: 4,
    },
    editButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: colors.textMuted,
        fontSize: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 16,
        color: colors.text,
    },
    card: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 14,
        marginBottom: 16,
    },
    deleteButton: {
        backgroundColor: colors.danger,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 32,
    },
    deleteText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
