import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface InventoryItem {
    _id: string;
    id: string;
    name: string;
    category: 'tools' | 'parts' | 'vehicles' | 'safety' | 'other';
    quantity: number;
    minQuantity: number;
    unit: string;
    price: number;
    currency: string;
    status: 'available' | 'in_use' | 'maintenance' | 'out_of_stock';
    location: string;
    sku: string;
    lastMaintained?: string;
    assignedTo?: string;
}

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async (filters?: any) => {
        try {
            setLoading(true);
            const response = await api.get('/inventory', { params: filters });
            setItems(response.data.map((item: any) => ({ ...item, id: item._id })));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur chargement inventaire');
        } finally {
            setLoading(false);
        }
    }, []);

    const createItem = async (data: any) => {
        try {
            const response = await api.post('/inventory', data);
            const newItem = { ...response.data, id: response.data._id };
            setItems(prev => [newItem, ...prev]);
            return newItem;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur création item');
        }
    };

    const updateItem = async (id: string, data: any) => {
        try {
            const response = await api.put(`/inventory/${id}`, data);
            setItems(prev => prev.map(item => item.id === id ? { ...response.data, id: response.data._id } : item));
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur mise à jour item');
        }
    };

    const deleteItem = async (id: string) => {
        try {
            await api.delete(`/inventory/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur suppression item');
        }
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        loading,
        error,
        fetchItems,
        createItem,
        updateItem,
        deleteItem
    };
};
