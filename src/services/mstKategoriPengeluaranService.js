import { API_URL } from '../config';
import axios from 'axios';

export const index = async (page = 1, limit = 10, search = '', tipe = '') => {
    const response = await axios.get(`${API_URL}/kategori-pengeluaran?page=${page}&limit=${limit}&search=${search}&tipe=${tipe}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const show = async (id) => {
    const response = await axios.get(`${API_URL}/kategori-pengeluaran/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const store = async (data) => {
    const response = await axios.post(`${API_URL}/kategori-pengeluaran`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const update = async (id, data) => {
    const response = await axios.put(`${API_URL}/kategori-pengeluaran/${id}`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const destroy = async (id) => {
    const response = await axios.delete(`${API_URL}/kategori-pengeluaran/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

