import { API_URL } from '../config';
import axios from 'axios';

export const index = async (page = 1, limit = 10, search = '', kategori = '') => {
    const response = await axios.get(`${API_URL}/rumah?page=${page}&limit=${limit}&search=${search}&kategori=${kategori}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const show = async (id) => {
    const response = await axios.get(`${API_URL}/rumah/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const store = async (data) => {
    const response = await axios.post(`${API_URL}/rumah`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const update = async (id, data) => {
    const response = await axios.put(`${API_URL}/rumah/${id}`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const destroyRumah = async (id) => {
    const response = await axios.delete(`${API_URL}/rumah/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

