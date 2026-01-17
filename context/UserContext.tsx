import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    image: string | null;
    setImage: (image: string | null) => void;
    isPro: boolean;
    setIsPro: (isPro: boolean) => void;
    saveUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [name, setName] = useState('Juan Pérez');
    const [email, setEmail] = useState('juan.perez@email.com');
    const [image, setImage] = useState<string | null>(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedName = await AsyncStorage.getItem('user_name');
            const storedEmail = await AsyncStorage.getItem('user_email');
            const storedImage = await AsyncStorage.getItem('user_image');
            const storedIsPro = await AsyncStorage.getItem('user_is_pro');

            if (storedName) setName(storedName);
            if (storedEmail) setEmail(storedEmail);
            if (storedImage) setImage(storedImage);
            if (storedIsPro) setIsPro(storedIsPro === 'true');
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const saveUserData = async () => {
        try {
            await AsyncStorage.setItem('user_name', name);
            await AsyncStorage.setItem('user_email', email);
            if (image) {
                await AsyncStorage.setItem('user_image', image);
            } else {
                await AsyncStorage.removeItem('user_image');
            }
            await AsyncStorage.setItem('user_is_pro', String(isPro));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            name,
            setName,
            email,
            setEmail,
            image,
            setImage,
            isPro,
            setIsPro,
            saveUserData
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
