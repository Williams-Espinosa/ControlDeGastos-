import { useExpenseContext } from '@/context/ExpenseContext';

export function useExpenses() {
    const { expenses, addExpense, removeExpense, updateExpense, isLoading } = useExpenseContext();

    return {
        expenses,
        addExpense,
        removeExpense,
        updateExpense,
        isLoading,
    };
}
