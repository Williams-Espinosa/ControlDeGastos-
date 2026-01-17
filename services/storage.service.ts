import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';

const EXPENSES_KEY = '@expenses';

/**
 * Cargado AsyncStorage
 */
export const loadExpenses = async (): Promise<Expense[]> => {
    try {
    const jsonValue = await AsyncStorage.getItem(EXPENSES_KEY);

    if (!jsonValue) {
    return [];
    }

    return JSON.parse(jsonValue) as Expense[];
    } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
    }
};

/**
 * Guardado AsyncStorage
 */
export const saveExpenses = async (expenses: Expense[]): Promise<void> => {
    try {
    const jsonValue = JSON.stringify(expenses);
    await AsyncStorage.setItem(EXPENSES_KEY, jsonValue);
    } catch (error) {
    console.error('Error saving expenses:', error);
    }
};

/**
 * Limpiar AsyncStorage (opcional, útil para debug o reset)
 */
export const clearExpenses = async (): Promise<void> => {
    try {
    await AsyncStorage.removeItem(EXPENSES_KEY);
    } catch (error) {
    console.error('Error clearing expenses:', error);
    }
};
