import api from '@/lib/api';

export const indexRumahPenghuni = async (page = 1, limit = 10, search = '', status = '', rumah_id = '') => {
    const response = await api.get('/rumah-penghuni', { params: { page, limit, search, status, rumah_id } });
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/rumah-penghuni/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/rumah-penghuni', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/rumah-penghuni/${id}`, data);
    return response.data;
};

export const destroyPenghuni = async (id) => {
    const response = await api.delete(`/rumah-penghuni/${id}`);
    return response.data;
};
