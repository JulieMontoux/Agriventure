const API_BASE_URL = 'http://127.0.0.1:8000';


const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};


const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export interface CompanySettings {
    id?: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo_path?: string;
}

export interface InvoiceSettings {
    id?: number;
    payment_terms: string;
    delivery_time: string;
}

export interface UserData {
    id: number;
    username: string;
    role: string;
}

export interface CreateSellerData {
    name: string;
    birth_date: string;
    password: string;
}

export interface PasswordChangeData {
    old_password: string;
    new_password: string;
}

export const settingsAPI = {
    async getCurrentUser(): Promise<UserData> {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async getCompanySettings(): Promise<CompanySettings> {
        const response = await fetch(`${API_BASE_URL}/company-settings/`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

async updateCompanySettings(settings: CompanySettings): Promise<CompanySettings> {
    if (!settings.id) {
        throw new Error('ID requis pour mettre à jour les paramètres de l\'entreprise.');
    }

    const response = await fetch(`${API_BASE_URL}/company-settings/${settings.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
    });
    return handleResponse(response);
},

    async getInvoiceSettings(): Promise<InvoiceSettings> {
        const response = await fetch(`${API_BASE_URL}/invoice-settings/`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async updateInvoiceSettings(settings: Partial<InvoiceSettings>): Promise<InvoiceSettings> {
        const response = await fetch(`${API_BASE_URL}/invoice-settings/`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(settings)
        });
        return handleResponse(response);
    },

    async getAllUsers(): Promise<UserData[]> {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async createSeller(sellerData: CreateSellerData): Promise<UserData> {
        const response = await fetch(`${API_BASE_URL}/sellers/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(sellerData)
        });
        return handleResponse(response);
    },

    async changeMyPassword(passwordData: PasswordChangeData): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordData)
        });
        return handleResponse(response);
    },

    // Utility: Generate random password
    generateRandomPassword(length: number = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
};