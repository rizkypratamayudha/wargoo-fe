import { API_URL } from '../config';
import axios from 'axios';

export const index = async (page = 1, limit = 10, search = '', status = '') => {
    const response = await axios.get(`${API_URL}/penghuni?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const indexAll = async () => {
    const response = await axios.get(`${API_URL}/penghuni`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}



export const show = async (id) => {
    const response = await axios.get(`${API_URL}/penghuni/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}

export const store = async (data) => {
    const response = await axios.post(`${API_URL}/penghuni`, data)
    return response.data
}

export const update = async (id, data) => {
    const response = await axios.post(`${API_URL}/penghuni/${id}`, data)
    return response.data
}

export const destroyPenghuni = async (id) => {
    const response = await axios.delete(`${API_URL}/penghuni/${id}`, {
        headers: {
            'Content-Type': 'Application/json'
        }
    })
    return response.data
}
