import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Switch, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { TopBar } from '@/components/ui/TopBar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const { name, setName, email, setEmail, image, setImage, saveUserData, isPro } = useUser();
    const [password, setPassword] = useState('');

    const styles = makeStyles(colors);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert('Error', 'El nombre y correo son obligatorios');
            return;
        }
        
        await saveUserData();
        Alert.alert('Perfil Actualizado', 'Tu foto y datos se han guardado correctamente.');
    };

    return (
        <View style={styles.container}>
            <TopBar title="Perfil de Usuario" showAvatar={false} showTime={false} />
            
            <ScrollView style={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <Pressable onPress={pickImage} style={styles.avatarContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={40} color={colors.text} />
                            </View>
                        )}
                        <View style={styles.cameraIcon}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </View>
                    </Pressable>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{name}</Text>
                        <Text style={styles.userEmail}>{email}</Text>
                    </View>
                </View>

                {/* Account Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de Cuenta</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Nombre</Text>
                        <TextInput 
                            style={styles.input} 
                            value={name}
                            onChangeText={setName}
                            placeholder="Nombre"
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Correo Electrónico</Text>
                        <TextInput 
                            style={styles.input} 
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Correo"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Contraseña (******)</Text>
                        <TextInput 
                            style={styles.input} 
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Nueva contraseña (opcional)"
                            placeholderTextColor={colors.textMuted}
                            secureTextEntry
                        />
                    </View>
                    
                    <Pressable style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Información</Text>
                    </Pressable>
                </View>

                {/* Subscription Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Suscripción</Text>
                    {isPro ? (
                        <View style={styles.proCard}>
                            <Text style={styles.proText}>Plan Único PRO Activo</Text>
                            <View style={styles.checkCircle}>
                                <Ionicons name="checkmark" size={12} color="#22d3ee" />
                            </View>
                        </View>
                    ) : (
                        <>
                            <View style={styles.subscriptionCard}>
                                <Text style={styles.subscriptionText}>Mi Plan: Prueba Gratuita</Text>
                            </View>
                            <Text style={styles.subscriptionSubtext}>Sin subscripciones, solo planes únicos.</Text>
                            <Pressable onPress={() => router.push('/upgrade')}>
                                <Text style={styles.upgradeLink}>Mejora tu plan único</Text>
                            </Pressable>
                        </>
                    )}
                </View>

                {/* Visualization Mode */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Modo de Visualización</Text>
                    <View style={styles.modeContainer}>
                        <Pressable 
                            style={[styles.modeButton, isDarkMode && styles.modeButtonActive]}
                            onPress={() => !isDarkMode && toggleTheme()}
                        >
                            <Ionicons name="moon" size={24} color={isDarkMode ? colors.primary : colors.textMuted} />
                            <Text style={[styles.modeText, isDarkMode && styles.modeTextActive]}>Modo Oscuro</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.modeButton, !isDarkMode && styles.modeButtonActive]}
                            onPress={() => isDarkMode && toggleTheme()}
                        >
                            <Ionicons name="sunny" size={24} color={!isDarkMode ? colors.primary : colors.textMuted} />
                            <Text style={[styles.modeText, !isDarkMode && styles.modeTextActive]}>Modo Claro</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seguridad</Text>
                    <View style={styles.securityRow}>
                        <Pressable style={styles.changePasswordButton}>
                            <Ionicons name="shield-checkmark" size={20} color={colors.text} />
                            <Text style={styles.changePasswordText}>Cambiar Contraseña</Text>
                        </Pressable>
                        <Pressable style={styles.logoutButton}>
                            <Text style={styles.logoutText}>Cerrar Sesión</Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable style={styles.deleteAccountButton}>
                    <Text style={styles.deleteAccountText}>Eliminar Cuenta</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>App Personal v1.0</Text>
                    <Text style={styles.versionText}>Desarrollado con Firebase</Text>
                </View>
                
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
        padding: 20,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.background,
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: colors.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputLabel: {
        color: colors.textMuted,
        fontSize: 12,
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.textMuted + '30', // Low opacity border
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    proCard: {
        backgroundColor: '#22d3ee', // Cyan
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    proText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.textMuted + '30',
    },
    subscriptionText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 15,
    },
    subscriptionSubtext: {
        color: colors.textMuted,
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 4,
    },
    upgradeLink: {
        color: colors.primary,
        textAlign: 'center',
        fontWeight: '600',
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    modeButton: {
        flex: 1,
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.textMuted + '30',
    },
    modeButtonActive: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    modeText: {
        color: colors.textMuted,
        fontWeight: '600',
    },
    modeTextActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    securityRow: {
        flexDirection: 'row',
        gap: 12,
    },
    changePasswordButton: {
        flex: 2,
        backgroundColor: colors.card,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.textMuted + '30',
    },
    changePasswordText: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
    logoutButton: {
        flex: 1,
        backgroundColor: colors.danger,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    deleteAccountButton: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    deleteAccountText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    versionText: {
        color: colors.textMuted,
        fontSize: 10,
    },
});
