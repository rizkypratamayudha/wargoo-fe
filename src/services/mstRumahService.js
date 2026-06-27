import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', kategori = '') => {
    const response = await api.get('/rumah', { params: { page, limit, search, kategori } });
    return response.data;
};

export const indexAll = async () => {
    const response = await api.get('/rumah');
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/rumah/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/rumah', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/rumah/${id}`, data);
    return response.data;
};

export const destroyRumah = async (id) => {
    const response = await api.delete(`/rumah/${id}`);
    return response.data;
};
