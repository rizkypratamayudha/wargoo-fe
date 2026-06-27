import api from '@/lib/api';

export const getUsers = async (page = 1, limit = 10, search = '', role = '') => {
    const response = await api.get('/users', { params: { page, limit, search, role } });
    return response.data;
};

export const getUsersById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (body) => {
    const response = await api.post('/users', body);
    return response.data;
};

export const updateUser = async (id, body) => {
    const response = await api.put(`/users/${id}`, body);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
