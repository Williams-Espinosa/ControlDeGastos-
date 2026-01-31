import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { useCamera } from '@/hooks/useCamera';
import { useTheme } from '@/context/ThemeContext';
import { Expense } from '@/types/expense';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

export default function AddExpenseScreen() {
    const router = useRouter();
    const { addExpense } = useExpenses();
    const { takePhoto, scanReceipt, pickImage } = useCamera();
    const { colors } = useTheme();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>();

    const styles = makeStyles(colors);

    const categories = ['🍔 Comida', '🚗 Transporte', '🏠 Hogar', '🎮 Entretenimiento', '💊 Salud', '📚 Educación', '👕 Ropa', '💼 Otros'];

    const handleSave = () => {
        if (!title || !amount || !category) {
            alert('Completa todos los campos');
            return;
        }

        const newExpense: Expense = {
            id: uuidv4(),
            title,
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
        if (uri) {
            setImageUri(uri);
        }
    };

    const handlePickImage = async () => {
        const uri = await pickImage();
        if (uri) {
            setImageUri(uri);
        }
    };

    const handleScanReceipt = async () => {
        const result = await scanReceipt();
        if (result) {
            setImageUri(result.imageUri);
            
            // If OCR found an amount, suggest it
            if (result.ocrResult.amount) {
                setAmount(result.ocrResult.amount.toString());
            }
            
            // If category was suggested
            if (result.suggestedCategory) {
                setCategory(result.suggestedCategory);
            }

            Alert.alert(
                '📷 Recibo escaneado',
                'Revisa y completa los datos del gasto.\n\nNota: Para OCR completo se requiere configuración nativa adicional.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Nuevo Gasto</Text>
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

                <Text style={styles.sectionTitle}>📷 Foto del Recibo</Text>

                <View style={styles.photoButtons}>
                    <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.photoText}>Cámara</Text>
                    </Pressable>

                    <Pressable style={styles.scanButton} onPress={handleScanReceipt}>
                        <Ionicons name="scan" size={20} color="#fff" />
                        <Text style={styles.scanText}>OCR</Text>
                    </Pressable>

                    <Pressable style={styles.galleryButton} onPress={handlePickImage}>
                        <Ionicons name="images" size={20} color="#fff" />
                        <Text style={styles.galleryText}>Galería</Text>
                    </Pressable>
                </View>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>💾 Guardar gasto</Text>
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
        marginBottom: 16,
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    photoButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: colors.secondary,
        padding: 12,
        borderRadius: 12,
    },
    photoText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    scanButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#8b5cf6',
        padding: 12,
        borderRadius: 12,
    },
    scanText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    galleryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#f59e0b',
        padding: 12,
        borderRadius: 12,
    },
    galleryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
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
