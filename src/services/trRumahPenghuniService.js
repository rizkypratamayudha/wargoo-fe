import { API_URL } from '../config';
import axios from 'axios';

export const indexRumahPenghuni = async (page = 1, limit = 10, search = '', status = '', rumah_id = '') => {
    const response = await axios.get(`${API_URL}/rumah-penghuni?page=${page}&limit=${limit}&search=${search}&status=${status}&rumah_id=${rumah_id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const show = async (id) => {
    const response = await axios.get(`${API_URL}/rumah-penghuni/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const store = async (data) => {
    const response = await axios.post(`${API_URL}/rumah-penghuni`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const update = async (id, data) => {
    const response = await axios.put(`${API_URL}/rumah-penghuni/${id}`, data, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const destroyPenghuni = async (id) => {
    const response = await axios.delete(`${API_URL}/rumah-penghuni/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}
