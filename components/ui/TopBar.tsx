import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';

interface TopBarProps {
    title: string;
    showAvatar?: boolean;
    showTime?: boolean;
}

export const TopBar = ({ title, showAvatar = true, showTime = true }: TopBarProps) => {
    const router = useRouter();
    const { colors } = useTheme();
    const { image } = useUser();
    const styles = makeStyles(colors);

    const handlePressNotifications = () => {
        router.push('(tabs)/notificaciones');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {showAvatar && (
                    <View style={styles.avatar}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={24} color={colors.primary} />
                        )}
                    </View>
                )}

                <Text style={styles.title}>{title}</Text>

                <Pressable onPress={handlePressNotifications} style={styles.notificationButton}>
                    <Ionicons name="notifications" size={24} color={colors.text} />
                </Pressable>
            </View>
        </View>
    );
};

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    time: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
    },
    notificationButton: {
        padding: 4,
    },
});
