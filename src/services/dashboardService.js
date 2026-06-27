import api from '@/lib/api';

export const getSummary = async (year) => {
    const response = await api.get('/dashboard/summary', { params: { year } });
    return response.data;
};

export const getDetail = async (year, month) => {
    const response = await api.get('/dashboard/detail', { params: { year, month } });
    return response.data;
};
