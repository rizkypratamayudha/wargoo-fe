import api from '@/lib/api';

export const index = async (page = 1, limit = 10, search = '', tanggalAwal = '', tanggalAkhir = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    if (tanggalAwal) params.tanggal_awal = tanggalAwal;
    if (tanggalAkhir) params.tanggal_akhir = tanggalAkhir;

    const response = await api.get('/pembayaran', { params });
    return response.data;
};

export const show = async (id) => {
    const response = await api.get(`/pembayaran/${id}`);
    return response.data;
};
