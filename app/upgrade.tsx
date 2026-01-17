import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Image, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { TopBar } from '@/components/ui/TopBar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard } from '@/components/ui/CreditCard';

export default function UpgradeScreen() {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const { setIsPro, saveUserData } = useUser();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'native'>('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const isIOS = Platform.OS === 'ios';
    const nativePayName = isIOS ? 'Apple Pay' : 'Google Pay';
    const nativePayIcon = isIOS ? 'logo-apple' : 'logo-google';

    const styles = makeStyles(colors, isDarkMode);

    const features = [
        'Recordatorios todos los dias',
        'Estadisticas Diarias',
        'Pago Unico',
        '100 % Seguro'
    ];

    const handlePurchase = () => {
        if (paymentMethod === 'native') {
            handleNativePay();
            return;
        }

        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
            Alert.alert('Error', 'Por favor completa todos los datos de la tarjeta');
            return;
        }
        
        // Simulate Card Processing
        Alert.alert('Procesando Pago', 'Validando tarjeta...', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'OK', onPress: () => {
                setTimeout(async () => {
                    setIsPro(true);
                    await saveUserData();
                    Alert.alert('✅ Compra Exitosa', '¡Bienvenido al Plan Único PRO!');
                    router.back();
                }, 1500);
            }}
        ]);
    };

    const handleNativePay = () => {
        // Simulate Native Pay Sheet
        Alert.alert(
            isIOS ? ' Pay' : 'Google Pay',
            `Expense Tracker Pro\n$500.00 MXN\n\nConfirma con ${isIOS ? 'Face ID o Touch ID' : 'tu huella o PIN'}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Pagar', 
                    onPress: () => {
                        // Simulate processing time
                        setTimeout(async () => {
                            setIsPro(true);
                            await saveUserData();
                            Alert.alert('✅ Pago Realizado', `Tu cuenta ha sido actualizada con ${nativePayName}`);
                            router.back();
                        }, 1000);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Custom Header for this screen */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Compra tu Plan Único</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Visual Credit Card - Shows when Card payment is selected */}
                {paymentMethod === 'card' && (
                    <CreditCard 
                        cardNumber={cardNumber}
                        cardHolder={cardHolder}
                        expiryDate={expiryDate}
                        cvv={cvv}
                        showBack={focusedField === 'cvv'}
                    />
                )}

                {/* Hero Section - Show only if card input is focused to save space, or if not card payment */}
                {paymentMethod !== 'card' && (
                    <View style={styles.heroSection}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={64} color="#22d3ee" />
                            <View style={styles.glowEffect} />
                        </View>
                        <Text style={styles.planName}>Plan Único PRO</Text>
                        <Text style={styles.planDescription}>Acceso Total. Un solo pago, para siempre.</Text>
                        
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>$500</Text>
                            <Text style={styles.currency}>MXN</Text>
                        </View>
                    </View>
                )}

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={16} color="#0f172a" />
                            </View>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                {/* Payment Methods */}
                <Text style={styles.sectionTitle}>Elige tu Método de Pago</Text>
                <View style={styles.paymentMethods}>
                    <Pressable 
                        style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodActive]}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <Ionicons name="card" size={24} color={paymentMethod === 'card' ? '#22d3ee' : colors.textMuted} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'card' && styles.paymentMethodTextActive]}>Tarjeta</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.paymentMethod, paymentMethod === 'native' && styles.paymentMethodActive]}
                        onPress={() => setPaymentMethod('native')}
                    >
                        <Ionicons name={nativePayIcon} size={24} color={paymentMethod === 'native' ? '#22d3ee' : colors.textMuted} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'native' && styles.paymentMethodTextActive]}>
                            {isIOS ? 'Pay' : 'GPay'}
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Recomendado</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Card Form */}
                {paymentMethod === 'card' && (
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número de Tarjeta</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                onFocus={() => setFocusedField('number')}
                                onBlur={() => setFocusedField(null)}
                                maxLength={16}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre del Titular</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Como aparece en la tarjeta"
                                placeholderTextColor={colors.textMuted}
                                value={cardHolder}
                                onChangeText={setCardHolder}
                                onFocus={() => setFocusedField('holder')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Expira</Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="MM/AA"
                                    placeholderTextColor={colors.textMuted}
                                    value={expiryDate}
                                    onChangeText={setExpiryDate}
                                    onFocus={() => setFocusedField('expiry')}
                                    onBlur={() => setFocusedField(null)}
                                    maxLength={5}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>CVV</Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="123"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="numeric"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    onFocus={() => setFocusedField('cvv')}
                                    onBlur={() => setFocusedField(null)}
                                    maxLength={4}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Confirm Button */}
                <Pressable 
                    style={[
                        styles.confirmButton, 
                        paymentMethod === 'native' && styles.applePayButton,
                        paymentMethod === 'native' && !isIOS && { backgroundColor: '#1f1f1f', borderColor: '#333' }
                    ]} 
                    onPress={handlePurchase}
                >
                    {paymentMethod === 'native' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.applePayText}>Pagar con</Text>
                            <Ionicons name={nativePayIcon} size={24} color="#fff" />
                            <Text style={styles.applePayText}>{isIOS ? 'Pay' : 'Pay'}</Text>
                        </View>
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
                    )}
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Pago único, no es una suscripción recurrente.</Text>
                    <Text style={styles.footerVersion}>v1.0</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const makeStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
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
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#22d3ee',
        opacity: 0.2,
        transform: [{ scale: 1.5 }],
    },
    planName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#22d3ee', // Cyan
        marginBottom: 8,
    },
    planDescription: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    price: {
        fontSize: 40,
        fontWeight: '800',
        color: colors.text,
    },
    currency: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textMuted,
    },
    featuresContainer: {
        gap: 16,
        marginBottom: 32,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#22d3ee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.textMuted + '20',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    paymentMethod: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.textMuted + '30',
        position: 'relative',
    },
    paymentMethodActive: {
        borderColor: '#22d3ee',
        backgroundColor: isDarkMode ? '#1e293b' : '#f0f9ff',
    },
    paymentMethodText: {
        color: colors.textMuted,
        fontWeight: '600',
    },
    paymentMethodTextActive: {
        color: colors.text,
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#f59e0b',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    form: {
        gap: 16,
        marginBottom: 32,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: colors.textMuted,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.textMuted + '30',
    },
    confirmButton: {
        backgroundColor: '#22d3ee',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmButtonText: {
        color: '#0f172a', // Dark text on cyan background for contrast
        fontSize: 18,
        fontWeight: '700',
    },
    applePayButton: {
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#333',
    },
    applePayText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
    },
    footerVersion: {
        fontSize: 10,
        color: colors.textMuted + '80',
    },
});
