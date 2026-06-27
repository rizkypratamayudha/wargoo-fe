import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/iuran', { params: { page, limit, search } });
    return response.data;
};

export const indexAll = async () => {
    const response = await api.get('/iuran');
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/iuran/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/iuran', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/iuran/${id}`, data);
    return response.data;
};

export const destroyIuran = async (id) => {
    const response = await api.delete(`/iuran/${id}`);
    return response.data;
};
