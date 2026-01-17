// OCR Service for receipt scanning
// Note: This uses expo-image-picker + ML Kit for text recognition

export interface OCRResult {
    text: string;
    amount?: number;
    possibleDate?: string;
    lines: string[];
}

// Extract amount from text using regex patterns
const extractAmount = (text: string): number | undefined => {
    // Common patterns for amounts in receipts
    const patterns = [
        /\$\s*([\d,]+\.?\d*)/g,  // $100.00 or $ 100.00
        /total[:\s]*\$?\s*([\d,]+\.?\d*)/gi,
        /total\s*:\s*([\d,]+\.?\d*)/gi,
        /monto[:\s]*\$?\s*([\d,]+\.?\d*)/gi,
        /importe[:\s]*\$?\s*([\d,]+\.?\d*)/gi,
        /([\d,]+\.?\d*)\s*(?:pesos|mxn|usd)/gi,
    ];

    const amounts: number[] = [];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const value = parseFloat(match[1].replace(',', ''));
            if (!isNaN(value) && value > 0) {
                amounts.push(value);
            }
        }
    }

    // Return the largest amount (usually the total)
    if (amounts.length > 0) {
        return Math.max(...amounts);
    }

    return undefined;
};

// Extract date from text
const extractDate = (text: string): string | undefined => {
    const patterns = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // DD/MM/YYYY or DD-MM-YYYY
        /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD or YYYY-MM-DD
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }

    return undefined;
};

// Parse OCR text result
export const parseOCRText = (text: string): OCRResult => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const amount = extractAmount(text);
    const possibleDate = extractDate(text);

    return {
        text,
        amount,
        possibleDate,
        lines,
    };
};

// Process image and extract text (mock for now, real implementation needs native module)
export const processReceiptImage = async (imageUri: string): Promise<OCRResult> => {
    // For a real implementation with ML Kit, you would need:
    // import TextRecognition from '@react-native-ml-kit/text-recognition';
    // const result = await TextRecognition.recognize(imageUri);
    
    // For now, return a mock result indicating the feature needs native setup
    console.log('Processing image:', imageUri);
    
    return {
        text: 'OCR requires native module setup. Take a photo and manually enter the amount.',
        lines: ['Para usar OCR completo, necesitas configurar el módulo nativo.'],
        amount: undefined,
        possibleDate: undefined,
    };
};

// Suggest category based on extracted text
export const suggestCategory = (text: string): string | undefined => {
    const lowerText = text.toLowerCase();

    const categoryMappings: Record<string, string[]> = {
        '🍔 Comida': ['restaurante', 'comida', 'food', 'cafe', 'starbucks', 'mcdonalds', 'burger', 'pizza', 'tacos'],
        '🚗 Transporte': ['uber', 'didi', 'gasolina', 'gas', 'estacionamiento', 'taxi', 'metro', 'autobus'],
        '🏠 Hogar': ['home depot', 'luz', 'agua', 'cfe', 'telmex', 'internet', 'renta', 'rent'],
        '💊 Salud': ['farmacia', 'doctor', 'hospital', 'medicina', 'pharmacy', 'salud'],
        '👕 Ropa': ['zara', 'h&m', 'ropa', 'clothing', 'nike', 'adidas', 'liverpool', 'palacio'],
        '🎮 Entretenimiento': ['netflix', 'spotify', 'cine', 'cinema', 'videojuegos', 'steam', 'xbox'],
        '📚 Educación': ['escuela', 'universidad', 'libros', 'books', 'udemy', 'curso'],
    };

    for (const [category, keywords] of Object.entries(categoryMappings)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            return category;
        }
    }

    return '💼 Otros';
};
