// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
  register: (
    email: string,
    password: string,
    name: string,
    photoUrl?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Setup listener on initial store load
      onAuthStateChanged(auth, (user) => {
        set({ user, isLoading: false, hydrated: true });
      });

      return {
        user: null,
        isLoading: true,
        error: null,
        hydrated: false,
        register: async (email, password, name, photoUrl) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
              displayName: name,
              photoURL: photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
            });

            set({ user, error: null });
          } catch (error: any) {
            set({ error: error.message });
          }
        },
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            set({ user: user, isLoading: false });
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
          }
        },
        logout: async () => {
          await signOut(auth);
          set({ user: null, isLoading: false });
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => () => {
        // mark that we've hydrated from storage
        useAuthStore.setState({ hydrated: true });
      },
    }
  )
);
