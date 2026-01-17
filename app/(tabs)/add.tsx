import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AddScreen() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to add-expense screen
        router.push('/add-expense');
    }, []);

    return null;
}
