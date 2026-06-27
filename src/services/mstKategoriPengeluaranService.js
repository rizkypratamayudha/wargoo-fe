import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', tipe = '') => {
    const response = await api.get('/kategori-pengeluaran', { params: { page, limit, search, tipe } });
    return response.data;
};

export const indexAll = async () => {
    const response = await api.get('/kategori-pengeluaran', { params: { limit: 100 } });
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/kategori-pengeluaran/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/kategori-pengeluaran', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/kategori-pengeluaran/${id}`, data);
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/kategori-pengeluaran/${id}`);
    return response.data;
};
