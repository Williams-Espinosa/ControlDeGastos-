import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { colors } from '@/styles/colors';

interface Props {
    labels: string[];
    data: number[];
    title?: string;
}

const screenWidth = Dimensions.get('window').width;

export const LineChartComponent = ({ labels, data, title }: Props) => {
    if (data.length === 0 || data.every(d => d === 0)) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay datos para mostrar</Text>
            </View>
        );
    }

    const chartData = {
        labels,
        datasets: [{ data }],
    };

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <RNLineChart
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
                    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '5',
                        strokeWidth: '2',
                        stroke: colors.secondary,
                    },
                }}
                bezier
                style={{
                    borderRadius: 16,
                }}
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
