import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { TopBar } from '@/components/ui/TopBar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { name, setName, email, setEmail, image, setImage, saveUserData } = useUser();

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
        Alert.alert('Perfil Actualizado', 'Tu información se ha guardado correctamente.');
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
                    <Text style={styles.sectionTitle}>Información de Perfil</Text>
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
                    
                    <Pressable style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Información</Text>
                    </Pressable>
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
        borderColor: colors.textMuted + '30',
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
});
