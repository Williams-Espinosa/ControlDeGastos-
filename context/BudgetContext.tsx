import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Budget {
    id: string;
    category: string;
    limit: number;
    period: 'semanal' | 'mensual';
}

interface BudgetContextType {
    budgets: Budget[];
    addBudget: (budget: Budget) => void;
    removeBudget: (id: string) => void;
    updateBudget: (id: string, budget: Budget) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = '@expense_tracker_budgets';

export function BudgetProvider({ children }: { children: ReactNode }) {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        loadBudgets();
    }, []);

    useEffect(() => {
        saveBudgets();
    }, [budgets]);

    const loadBudgets = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBudgets(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading budgets:', error);
        }
    };

    const saveBudgets = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
        } catch (error) {
            console.error('Error saving budgets:', error);
        }
    };

    const addBudget = (budget: Budget) => {
        setBudgets(prev => [...prev, budget]);
    };

    const removeBudget = (id: string) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    const updateBudget = (id: string, budget: Budget) => {
        setBudgets(prev => prev.map(b => b.id === id ? budget : b));
    };

    return (
        <BudgetContext.Provider value={{ budgets, addBudget, removeBudget, updateBudget }}>
            {children}
        </BudgetContext.Provider>
    );
}

export function useBudgetContext() {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudgetContext debe usarse dentro de BudgetProvider');
    }
    return context;
}
