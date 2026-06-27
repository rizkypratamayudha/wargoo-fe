import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', status = '', periode = '') => {
    const response = await api.get('/tagihan', { params: { page, limit, search, status, periode } });
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/tagihan/${id}`);
    return response.data;
};

export const generate = async (data) => {
    const response = await api.post('/tagihan/generate', data);
    return response.data;
};

export const bayar = async (id, data) => {
    const response = await api.post(`/tagihan/${id}/bayar`, data);
    return response.data;
};

export const batalBayar = async (id) => {
    const response = await api.post(`/tagihan/${id}/batal-bayar`);
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/tagihan/${id}`);
    return response.data;
};
