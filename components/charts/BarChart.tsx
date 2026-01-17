import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { colors } from '@/styles/colors';

interface Props {
    labels: string[];
    data: number[];
    title?: string;
}

const screenWidth = Dimensions.get('window').width;

export const BarChartComponent = ({ labels, data, title }: Props) => {
    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay datos para mostrar</Text>
            </View>
        );
    }

    const chartData = {
        labels: labels.map(l => l.slice(0, 8)), // Truncate labels
        datasets: [{ data }],
    };

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <RNBarChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: colors.card,
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    barPercentage: 0.7,
                }}
                style={{
                    borderRadius: 16,
                }}
                fromZero
                showValuesOnTopOfBars
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: 14,
    },
});
