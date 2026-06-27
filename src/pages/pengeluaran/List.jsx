import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { index, show, store, update, destroy } from "@/services/trPengeluaranService";
import { indexAll } from "@/services/mstKategoriPengeluaranService";
import { Eye, Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ListPengeluaran() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const [kategoriList, setKategoriList] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    kategori_pengeluaran_id: "",
    deskripsi: "",
    nominal: "",
    tanggal: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchKategori = async () => {
    try {
      const response = await indexAll();
      setKategoriList(response.data?.data || response.data || []);
    } catch (error) {
      console.error("error fetch kategori", error);
    }
  };

  const handleAdd = () => {
    setSelectedData(null);
    setViewMode(false);
    setFormData({ kategori_pengeluaran_id: "", deskripsi: "", nominal: "", tanggal: "" });
    setFormErrors({});
    setOpenForm(true);
  };

  const handleView = async (id) => {
    try {
      setLoadingAction(true);
      const response = await show(id);
      setSelectedData(response.data);
      setViewMode(true);
      setOpenForm(true);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoadingAction(true);
      const response = await show(id);
      const item = response.data;
      setSelectedData(item);
      setViewMode(false);
      setFormData({
        kategori_pengeluaran_id: String(item.kategori_pengeluaran_id),
        deskripsi: item.deskripsi,
        nominal: String(item.nominal),
        tanggal: item.tanggal?.split("T")[0] || "",
      });
      setFormErrors({});
      setOpenForm(true);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = (item) => {
    setDataToDelete(item);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoadingAction(true);
      await destroy(dataToDelete.id);
      setOpenDelete(false);
      setDataToDelete(null);
      toast.success("Berhasil", { description: "Pengeluaran berhasil dihapus" });
      fetchData();
    } catch (error) {
      toast.error("Gagal", { description: error.response?.data?.message || "Gagal menghapus" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      kategori_pengeluaran_id: Number(formData.kategori_pengeluaran_id),
      deskripsi: formData.deskripsi,
      nominal: Number(formData.nominal),
      tanggal: formData.tanggal,
    };

    try {
      setLoadingAction(true);
      if (selectedData) {
        await update(selectedData.id, payload);
        toast.success("Berhasil", { description: "Pengeluaran berhasil diupdate" });
      } else {
        await store(payload);
        toast.success("Berhasil", { description: "Pengeluaran berhasil ditambahkan" });
      }
      setOpenForm(false);
      fetchData();
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error("Gagal", { description: error.response?.data?.message || "Terjadi kesalahan" });
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await index(page, 10, debounceSearch, selectedKategori, tanggalAwal, tanggalAkhir);
      setData(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debounceSearch, selectedKategori, tanggalAwal, tanggalAkhir]);

  return (
    <div className="p-4">
      <Breadcrumbs />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Data Pengeluaran
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-2 border-dashed" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Tambah Pengeluaran
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs shrink-0"
            />
            <Select
              value={selectedKategori || "all"}
              onValueChange={(value) => {
                setSelectedKategori(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {kategoriList.map((k) => (
                  <SelectItem key={k.id} value={String(k.id)}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 shrink-0">
              <DatePicker value={tanggalAwal} onChange={setTanggalAwal} placeholder="Dari tanggal" className="w-[160px]" />
              <span className="text-muted-foreground text-sm">s/d</span>
              <DatePicker value={tanggalAkhir} onChange={setTanggalAkhir} placeholder="Sampai tanggal" className="w-[160px]" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No data</TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell>{item.kategori_pengeluaran?.nama || "-"}</TableCell>
                    <TableCell>{item.deskripsi}</TableCell>
                    <TableCell className="text-right">{formatRupiah(item.nominal)}</TableCell>
                    <TableCell>{item.user?.name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleView(item.id)} disabled={loadingAction}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)} disabled={loadingAction}>
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item)} disabled={loadingAction}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{viewMode ? "Detail Pengeluaran" : selectedData ? "Edit Pengeluaran" : "Tambah Pengeluaran"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewMode && (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-medium">{formatDate(selectedData?.tanggal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-medium">{selectedData?.kategori_pengeluaran?.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deskripsi</span>
                  <span className="font-medium">{selectedData?.deskripsi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nominal</span>
                  <span className="font-medium">{formatRupiah(selectedData?.nominal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dicatat Oleh</span>
                  <span className="font-medium">{selectedData?.user?.name}</span>
                </div>
              </div>
            )}

            {!viewMode && (
              <>
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <DatePicker
                    value={formData.tanggal}
                    onChange={(val) => {
                      setFormData({ ...formData, tanggal: val });
                      if (formErrors.tanggal) setFormErrors((p) => ({ ...p, tanggal: "" }));
                    }}
                  />
                  {formErrors.tanggal && <p className="text-sm text-red-500">{formErrors.tanggal}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Kategori Pengeluaran</Label>
                  <Select
                    value={formData.kategori_pengeluaran_id}
                    onValueChange={(val) => {
                      setFormData({ ...formData, kategori_pengeluaran_id: val });
                      if (formErrors.kategori_pengeluaran_id) setFormErrors((p) => ({ ...p, kategori_pengeluaran_id: "" }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriList.map((k) => (
                        <SelectItem key={k.id} value={String(k.id)}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.kategori_pengeluaran_id && <p className="text-sm text-red-500">{formErrors.kategori_pengeluaran_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Input
                    value={formData.deskripsi}
                    onChange={(e) => {
                      setFormData({ ...formData, deskripsi: e.target.value });
                      if (formErrors.deskripsi) setFormErrors((p) => ({ ...p, deskripsi: "" }));
                    }}
                    placeholder="Deskripsi pengeluaran"
                  />
                  {formErrors.deskripsi && <p className="text-sm text-red-500">{formErrors.deskripsi}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Nominal</Label>
                  <Input
                    type="number"
                    value={formData.nominal}
                    onChange={(e) => {
                      setFormData({ ...formData, nominal: e.target.value });
                      if (formErrors.nominal) setFormErrors((p) => ({ ...p, nominal: "" }));
                    }}
                    placeholder="0"
                  />
                  {formErrors.nominal && <p className="text-sm text-red-500">{formErrors.nominal}</p>}
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpenForm(false)} disabled={loadingAction}>
                {viewMode ? "Tutup" : "Cancel"}
              </Button>
              {!viewMode && (
                <Button onClick={handleSubmit} disabled={loadingAction}>
                  {loadingAction ? "Menyimpan..." : "Simpan"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengeluaran "<span className="font-semibold">{dataToDelete?.deskripsi}</span>" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingAction}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={loadingAction} className="bg-red-500 hover:bg-red-600">
              {loadingAction ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
