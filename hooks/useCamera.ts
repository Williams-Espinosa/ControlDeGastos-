import * as ImagePicker from 'expo-image-picker';
import { parseOCRText, suggestCategory, OCRResult } from '@/services/ocr.service';

export interface ScanResult {
    imageUri: string;
    ocrResult: OCRResult;
    suggestedCategory?: string;
}

export const useCamera = () => {
    const takePhoto = async (): Promise<string | null> => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            alert('Se requiere permiso para usar la cámara');
            return null;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0].uri;
    };

    const scanReceipt = async (): Promise<ScanResult | null> => {
        const imageUri = await takePhoto();
        if (!imageUri) return null;

        // For now, we'll use a simplified OCR result
        // Full OCR requires native module setup
        const mockText = 'Recibo escaneado - ingresa el monto manualmente';
        const ocrResult = parseOCRText(mockText);
        const suggestedCategory = suggestCategory(mockText);

        return {
            imageUri,
            ocrResult,
            suggestedCategory,
        };
    };

    const pickImage = async (): Promise<string | null> => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            alert('Se requiere permiso para acceder a la galería');
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0].uri;
    };

    return { takePhoto, scanReceipt, pickImage };
};
