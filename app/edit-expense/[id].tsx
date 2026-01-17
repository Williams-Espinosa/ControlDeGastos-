import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { useCamera } from '@/hooks/useCamera';
import { colors } from '@/styles/colors';
import { Expense } from '@/types/expense';
import { Ionicons } from '@expo/vector-icons';

export default function EditExpenseScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { expenses, updateExpense } = useExpenses();
    const { takePhoto } = useCamera();

    const expense = expenses.find(e => e.id === id);

    const [title, setTitle] = useState(expense?.title || '');
    const [amount, setAmount] = useState(expense?.amount.toString() || '');
    const [category, setCategory] = useState(expense?.category || '');
    const [imageUri, setImageUri] = useState<string | undefined>(expense?.imageUri);

    const categories = ['🍔 Comida', '🚗 Transporte', '🏠 Hogar', '🎮 Entretenimiento', '💊 Salud', '📚 Educación', '👕 Ropa', '💼 Otros'];

    useEffect(() => {
        if (!expense) {
            Alert.alert('Error', 'Gasto no encontrado');
            router.back();
        }
    }, [expense]);

    const handleSave = () => {
        if (!title || !amount || !category) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        if (!expense) return;

        const updatedExpense: Expense = {
            ...expense,
            title,
            amount: Number(amount),
            category,
            imageUri,
        };

        updateExpense(expense.id, updatedExpense);
        Alert.alert('Éxito', 'Gasto actualizado', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (uri) {
            setImageUri(uri);
        }
    };

    if (!expense) return null;

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Editar Gasto</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <TextInput
                    placeholder="Título del gasto"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    placeholder="Monto (ej: 150.00)"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryLabel}>Categoría</Text>
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

                <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
                    <Text style={styles.photoText}>
                        {imageUri ? '📷 Cambiar foto' : '📷 Tomar foto del recibo'}
                    </Text>
                </Pressable>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>💾 Actualizar gasto</Text>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    input: {
        backgroundColor: colors.card,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    categoryContainer: {
        marginBottom: 12,
    },
    categoryLabel: {
        color: colors.textMuted,
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '600',
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
        backgroundColor: colors.card,
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
    photoButton: {
        backgroundColor: colors.secondary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    photoText: {
        color: '#fff',
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
