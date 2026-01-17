import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Expense } from '@/types/expense';

export const generatePDF = async (expenses: Expense[]): Promise<void> => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reporte de Gastos</title>
            <style>
                body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                h1 { color: #0f172a; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; }
                .summary { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .summary h2 { margin: 0 0 10px 0; color: #38bdf8; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #0f172a; color: white; padding: 12px 8px; text-align: left; }
                td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; }
                tr:nth-child(even) { background: #f8fafc; }
                .amount { color: #22c55e; font-weight: bold; }
                .total { font-size: 24px; color: #38bdf8; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px; }
            </style>
        </head>
        <body>
            <h1>📊 Reporte de Gastos</h1>
            <div class="summary">
                <h2>Resumen</h2>
                <p>Total de gastos: <strong>${expenses.length}</strong></p>
                <p>Monto total: <span class="total">$${totalAmount.toFixed(2)}</span></p>
                <p>Fecha de generación: ${new Date().toLocaleDateString('es-MX')}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenses.map(expense => `
                        <tr>
                            <td>${expense.date}</td>
                            <td>${expense.title}</td>
                            <td>${expense.category}</td>
                            <td class="amount">$${expense.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>Generado por Control de Gastos Pro</p>
            </div>
        </body>
        </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html });
        
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Compartir reporte de gastos',
                UTI: 'com.adobe.pdf',
            });
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

export const generateCSV = async (expenses: Expense[]): Promise<void> => {
    const header = 'ID,Fecha,Título,Categoría,Monto\n';
    const rows = expenses.map(e => 
        `"${e.id}","${e.date}","${e.title}","${e.category}",${e.amount}`
    ).join('\n');
    
    const csv = header + rows;
    const fileName = `gastos_${new Date().toISOString().slice(0, 10)}.csv`;
    const directory = FileSystem.cacheDirectory;
    
    if (!directory) {
        throw new Error('Cache directory is not available');
    }

    const filePath = `${directory}${fileName}`;

    try {
        await FileSystem.writeAsStringAsync(filePath, csv, {
            encoding: 'utf8',
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath, {
                mimeType: 'text/csv',
                dialogTitle: 'Compartir datos de gastos (Excel/CSV)',
                UTI: 'public.comma-separated-values-text'
            });
        }
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw error;
    }
};

export const generateExcel = async (expenses: Expense[]): Promise<void> => {
    await generateCSV(expenses);
};
