// src/store/auth.ts
import { create } from 'zustand';
import { auth } from '../config/firebase'; // Adjust the path as necessary
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Setup auth listener
  onAuthStateChanged(auth, (user) => {
    set({ user, isLoading: false });
  });

  return {
    user: null,
    isLoading: true,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        set({ user: result.user, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        console.error("Login error:", error.message);
      }
    },

    logout: async () => {
      await signOut(auth);
      set({ user: null, isLoading: false });
      console.log("User logged out");
    },
  };
});
