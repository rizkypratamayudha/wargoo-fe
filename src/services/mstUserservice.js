import { API_URL } from '../config';
import axios from 'axios';

export const getUsers = async (page = 1, limit = 10, search = '', role = '') => {
    try {
        const response = await axios.get(`${API_URL}/users?page=${page}&limit=${limit}&search=${search}&role=${role}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const getUsersById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching users', error);
        throw error;
    }
}
export const createUser = async (body) => {
    const response = await axios.post(`${API_URL}/users`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

export const updateUser = async (id, body) => {
    const response = await axios.put(`${API_URL}/users/${id}`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}