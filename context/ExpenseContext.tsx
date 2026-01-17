import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense } from '@/types/expense';
import * as StorageService from '@/services/storage.service';

type ExpenseContextType = {
    expenses: Expense[];
    addExpense: (expense: Expense) => void;
    removeExpense: (id: string) => void;
    updateExpense: (id: string, expense: Expense) => void;
    isLoading: boolean;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const loaded = await StorageService.loadExpenses();
            setExpenses(loaded);
        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addExpense = async (expense: Expense) => {
        const updated = [expense, ...expenses];
        setExpenses(updated);
        await StorageService.saveExpenses(updated);
    };

    const removeExpense = async (id: string) => {
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        await StorageService.saveExpenses(updated);
    };

    const updateExpense = async (id: string, expense: Expense) => {
        const updated = expenses.map(e => e.id === id ? expense : e);
        setExpenses(updated);
        await StorageService.saveExpenses(updated);
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, removeExpense, updateExpense, isLoading }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenseContext() {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenseContext debe usarse dentro de ExpenseProvider');
    }
    return context;
}
