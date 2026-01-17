import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { colors } from '@/styles/colors';

interface PieChartData {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

interface Props {
    data: PieChartData[];
    title?: string;
}

const screenWidth = Dimensions.get('window').width;

const chartColors = [
    '#38bdf8', // primary
    '#22c55e', // secondary
    '#f59e0b', // amber
    '#ef4444', // danger
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
];

export const PieChartComponent = ({ data, title }: Props) => {
    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay datos para mostrar</Text>
            </View>
        );
    }

    const chartData = data.map((item, index) => ({
        ...item,
        color: chartColors[index % chartColors.length],
        legendFontColor: colors.textMuted,
        legendFontSize: 12,
    }));

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <RNPieChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
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
