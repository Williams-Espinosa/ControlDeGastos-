import 'react-native-get-random-values';
import { ThemeProvider } from '@/context/ThemeContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { BudgetProvider } from '@/context/BudgetContext';
import { UserProvider } from '@/context/UserContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
     SplashScreen.hideAsync();
  }, []);

  return (
    <UserProvider>
      <ThemeProvider>
        <ExpenseProvider>
          <BudgetProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="add-expense" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="expense/[id]" options={{ presentation: 'card', headerShown: false }} />
              <Stack.Screen name="edit-expense/[id]" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="upgrade" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
          </BudgetProvider>
        </ExpenseProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
