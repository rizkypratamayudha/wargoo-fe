import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', kategoriId = '', tanggalAwal = '', tanggalAkhir = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    if (kategoriId) params.kategori_id = kategoriId;
    if (tanggalAwal) params.tanggal_awal = tanggalAwal;
    if (tanggalAkhir) params.tanggal_akhir = tanggalAkhir;

    const response = await api.get('/pengeluaran', { params });
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/pengeluaran/${id}`);
    return response.data;
};

export const store = async (data) => {
    const response = await api.post('/pengeluaran', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/pengeluaran/${id}`, data);
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/pengeluaran/${id}`);
    return response.data;
};
