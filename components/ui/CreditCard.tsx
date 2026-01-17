import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    interpolate, 
    withSpring 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CreditCardProps {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    showBack: boolean;
}

const CARD_ASPECT_RATIO = 1.586; // Standard credit card aspect ratio
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 64; // Padding
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

export const CreditCard = ({ 
    cardNumber, 
    cardHolder, 
    expiryDate, 
    cvv, 
    showBack 
}: CreditCardProps) => {
    const rotate = useSharedValue(0);

    useEffect(() => {
        rotate.value = withTiming(showBack ? 1 : 0, { duration: 800 });
    }, [showBack]);

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);
        return {
            transform: [
                { rotateY: `${rotateValue}deg` }
            ],
            opacity: interpolate(rotate.value, [0, 0.5, 1], [1, 0, 0]),
            backfaceVisibility: 'hidden',
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
        return {
            transform: [
                { rotateY: `${rotateValue}deg` }
            ],
            opacity: interpolate(rotate.value, [0, 0.5, 1], [0, 0, 1]),
            backfaceVisibility: 'hidden',
        };
    });

    // Format card number with spaces
    const formattedNumber = cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
    const formattedExpiry = expiryDate.padEnd(5, '•');

    return (
        <View style={styles.container}>
            {/* Front Side */}
            <Animated.View style={[styles.cardFace, styles.frontFace, frontAnimatedStyle]}>
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={styles.gradient}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.chip} />
                        <Ionicons name="card" size={32} color="#fff" style={{ opacity: 0.8 }} />
                    </View>

                    <Text style={styles.cardNumber}>{formattedNumber}</Text>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.label}>Titular</Text>
                            <Text style={styles.value} numberOfLines={1}>
                                {cardHolder || 'NOMBRE APELLIDO'}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Expira</Text>
                            <Text style={styles.value}>{formattedExpiry}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Back Side */}
            <Animated.View style={[styles.cardFace, styles.backFace, backAnimatedStyle]}>
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={styles.gradient}
                >
                    <View style={styles.magneticStrip} />
                    
                    <View style={styles.signatureRow}>
                        <View style={styles.signatureStrip} />
                        <View style={styles.cvvBox}>
                            <Text style={styles.cvvText}>{cvv || '123'}</Text>
                        </View>
                    </View>

                    <Text style={styles.disclaimer}>
                        Esta tarjeta es intransferible y propiedad del emisor. El uso de esta tarjeta constituye la aceptación de los términos y condiciones.
                    </Text>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginVertical: 20,
        alignSelf: 'center',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    },
    frontFace: {
        zIndex: 2,
    },
    backFace: {
        zIndex: 1,
    },
    gradient: {
        flex: 1,
        padding: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    chip: {
        width: 50,
        height: 36,
        backgroundColor: '#fbbf24',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#b45309',
    },
    cardNumber: {
        fontSize: 22,
        color: '#fff',
        fontFamily: 'monospace',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 'auto',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 10,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // Back styles
    magneticStrip: {
        height: 48,
        backgroundColor: '#020617',
        marginHorizontal: -24,
        marginTop: 16,
        marginBottom: 24,
    },
    signatureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    signatureStrip: {
        flex: 1,
        height: 36,
        backgroundColor: '#cbd5e1',
        borderRadius: 4,
    },
    cvvBox: {
        width: 60,
        height: 36,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    cvvText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 8,
        color: '#64748b',
        textAlign: 'justify',
    },
});
