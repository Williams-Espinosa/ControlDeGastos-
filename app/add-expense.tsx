import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { useCamera } from '@/hooks/useCamera';
import { useTheme } from '@/context/ThemeContext';
import { Expense } from '@/types/expense';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '@/components/ui/TopBar';

export default function AddExpenseScreen() {
    const router = useRouter();
    const { addExpense } = useExpenses();
    const { takePhoto, pickImage } = useCamera();
    const { colors } = useTheme();

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>();

    const styles = makeStyles(colors);

    const categories = [
        '🍔 Comida',
        '🚗 Transporte',
        '🏠 Hogar',
        '🎮 Entretenimiento',
        '💊 Salud',
        '📚 Educación',
        '👕 Ropa',
        '💼 Otros',
    ];

    const handleSave = () => {
        if (!amount || !category) {
            alert('Selecciona una categoría e ingresa el monto');
            return;
        }

        const newExpense: Expense = {
            id: uuidv4(),
            title: category,
            amount: Number(amount),
            category,
            date: new Date().toISOString().slice(0, 10),
            imageUri,
        };

        addExpense(newExpense);
        router.back();
    };

    const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (uri) setImageUri(uri);
    };

    const handlePickImage = async () => {
        const uri = await pickImage();
        if (uri) setImageUri(uri);
    };

    return (
        <View style={styles.container}>
            <TopBar title="Agregar Gasto" />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Monto grande */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        placeholder="0.00"
                        placeholderTextColor={colors.textMuted}
                        style={styles.amountInput}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Categorías */}
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryLabel}>Categoría</Text>
                    <View style={styles.categoryGrid}>
                        {categories.map((cat) => (
                            <Pressable
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    category === cat && styles.categoryChipSelected,
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    category === cat && styles.categoryChipTextSelected,
                                ]}>
                                    {cat}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Adjuntar recibo */}
                <View style={styles.receiptContainer}>
                    <Text style={styles.sectionTitle}>📷 Adjuntar recibo</Text>
                    <View style={styles.photoButtons}>
                        <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
                            <Ionicons name="camera" size={28} color="#fff" />
                            <Text style={styles.photoText}>Cámara</Text>
                        </Pressable>
                        <Pressable style={styles.galleryButton} onPress={handlePickImage}>
                            <Ionicons name="images" size={28} color="#fff" />
                            <Text style={styles.galleryText}>Galería</Text>
                        </Pressable>
                    </View>
                </View>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                {/* Guardar */}
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                    <Text style={styles.saveText}>Guardar gasto</Text>
                </Pressable>

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
    // ── Monto ────────────────────────────────────────────────
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
    },
    // ── Categorías ───────────────────────────────────────────
    categoryContainer: {
        marginBottom: 20,
    },
    categoryLabel: {
        color: colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        width: '47%',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 14,
        backgroundColor: colors.card,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    categoryChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    categoryChipText: {
        color: colors.textMuted,
        fontSize: 15,
        fontWeight: '600',
    },
    categoryChipTextSelected: {
        color: '#fff',
    },
    // ── Recibo ───────────────────────────────────────────────
    receiptContainer: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 14,
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    photoButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#22c55e',
        paddingVertical: 18,
        borderRadius: 14,
    },
    photoText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    galleryButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#f59e0b',
        paddingVertical: 18,
        borderRadius: 14,
    },
    galleryText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
    },
    // ── Guardar ──────────────────────────────────────────────
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 16,
        marginTop: 4,
        marginBottom: 32,
    },
    saveText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});