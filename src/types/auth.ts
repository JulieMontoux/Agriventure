export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
}

export interface User {
    id: number;
    username: string;
    role: UserRole;
    companyId: number;
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}