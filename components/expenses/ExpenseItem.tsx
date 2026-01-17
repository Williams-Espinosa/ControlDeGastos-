import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Expense } from '@/types/expense';
import { colors } from '@/styles/colors';

interface Props {
    expense: Expense;
    onPress: () => void;
}

export const ExpenseItem = ({ expense, onPress }: Props) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View>
                <Text style={styles.title}>{expense.title}</Text>
                <Text style={styles.date}>{expense.date}</Text>
            </View>

            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    },
    title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    },
    date: {
    fontSize: 12,
    color: colors.textMuted,
    },
    amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    },
});
