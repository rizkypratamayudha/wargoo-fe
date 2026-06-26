import { API_URL } from '../config';
import axios from 'axios';

export const index = async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`${API_URL}/iuran?page=${page}&limit=${limit}&search=${search}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const show = async (id) => {
    const response = await axios.get(`${API_URL}/iuran/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const store = async (data) => {
    const response = await axios.post(`${API_URL}/iuran`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const update = async (id, data) => {
    const response = await axios.put(`${API_URL}/iuran/${id}`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const destroyIuran = async (id) => {
    const response = await axios.delete(`${API_URL}/iuran/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

