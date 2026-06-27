import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', status = '') => {
    const response = await api.get('/penghuni', { params: { page, limit, search, status } });
    return response.data;
};

export const indexAll = async () => {
    const response = await api.get('/penghuni');
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/penghuni/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/penghuni', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.post(`/penghuni/${id}`, data);
    return response.data;
};

export const destroyPenghuni = async (id) => {
    const response = await api.delete(`/penghuni/${id}`);
    return response.data;
};
