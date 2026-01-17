import { useBudgetContext } from '@/context/BudgetContext';

export function useBudgets() {
    const { budgets, addBudget, removeBudget, updateBudget } = useBudgetContext();

    return {
        budgets,
        addBudget,
        removeBudget,
        updateBudget,
    };
}
