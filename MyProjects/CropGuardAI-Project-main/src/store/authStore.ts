import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '@/lib/api'; // Import our new functions
import { AxiosError } from 'axios'; // Import AxiosError for type checking

interface User {
  id: string; // Our backend sends 'id', not '_id' (we transformed it)
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<void>;
  signup: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (name: string, password: string) => {
        try {
          // --- REAL API CALL ---
          // 1. Call the API
          const response = await loginUser(name, password);
          
          // 2. Get the user and token from the response
          const { user, token } = response.data;

          // 3. Save the token for our API client to use
          await AsyncStorage.setItem('userToken', token);

          // 4. Set the user in the state
          set({ user, isAuthenticated: true });

        } catch (error) {
          // 5. Handle errors
          if (error instanceof AxiosError && error.response) {
            // Throw the specific error message from the backend
            throw new Error(error.response.data.message);
          }
          throw new Error('Login failed. Please try again.');
        }
      },
      
      signup: async (name: string, password: string) => {
        try {
          // --- REAL API CALL ---
          // 1. Call the API
          const response = await registerUser(name, password);

          // 2. Get user and token
          const { user, token } = response.data;

          // 3. Save the token
          await AsyncStorage.setItem('userToken', token);

          // 4. Set state
          set({ user, isAuthenticated: true });

        } catch (error) {
          // 5. Handle errors
          if (error instanceof AxiosError && error.response) {
            // Throw the specific error message from the backend
            throw new Error(error.response.data.message);
          }
          throw new Error('Signup failed. Please try again.');
        }
      },
      
      logout: async () => {
        // Remove the token from storage
        await AsyncStorage.removeItem('userToken');
        // Clear the state
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);