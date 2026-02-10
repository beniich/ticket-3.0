import axios from 'axios';

// Configuration de l'instance axios par défaut
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Fonctions pour les settings
export async function getSettings(): Promise<any> {
    const response = await fetch('/api/settings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch settings');
    }

    return response.json();
}

export async function updateSettings(data: any): Promise<any> {
    const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update settings');
    }

    return response.json();
}

export async function updatePartialSettings(updates: any): Promise<any> {
    const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update settings');
    }

    return response.json();
}

// Fonctions pour les tickets
export async function getTicket(id: string): Promise<any> {
    const response = await fetch(`/api/tickets/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch ticket');
    }

    return response.json();
}

export async function addTicketNote(id: string, note: any): Promise<any> {
    const response = await fetch(`/api/tickets/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });

    if (!response.ok) {
        throw new Error('Failed to add note');
    }

    return response.json();
}
