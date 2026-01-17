import { View, Text } from 'react-native';
import { Expense } from '@/types/expense';
import { ExpenseItem } from './ExpenseItem';
import { useRouter } from 'expo-router';

interface Props {
    expenses: Expense[];
}

export const ExpenseList = ({ expenses }: Props) => {
    const router = useRouter();

    if (expenses.length === 0) {
        return <Text>No hay gastos registrados</Text>;
    }

    return (
        <View>
            {expenses.map((item) => (
                <ExpenseItem
                    key={item.id}
                    expense={item}
                    onPress={() => router.push(`/expense/${item.id}`)}
                />
            ))}
        </View>
    );
};
