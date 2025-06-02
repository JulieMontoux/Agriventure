import { User } from '../types/auth';

const USER_STORAGE_KEY: string = 'agriventure_user';
export const storeUser = (user: User): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  const userData: string | null = localStorage.getItem(USER_STORAGE_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'erreur inconnue';
    console.error(`erreur lors de la récupération des données utilisateur: ${errorMessage}`);
    return null;
  }
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};