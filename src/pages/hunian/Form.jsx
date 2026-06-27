import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, update } from "@/services/trRumahPenghuniService";
import { API_URL } from "@/config";
import { useEffect, useState } from "react";

const STORAGE_BASE = API_URL.replace(/\/api\/?$/, "") + "/storage/";

export default function FormHunian({ open, onClose, data, onSuccess, dataRumah, dataPenghuni }) {
  const [formData, setFormData] = useState({
    rumah_id: "",
    penghuni_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });

  const [selectedRumah, setSelectedRumah] = useState(null);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!data;

  useEffect(() => {
    if (!open) return;

    if (data) {
      const rumahId = String(data.rumah_id || "");
      const penghuniId = String(data.penghuni_id || "");
      setFormData({
        rumah_id: rumahId,
        penghuni_id: penghuniId,
        tanggal_mulai: data.tanggal_mulai || "",
        tanggal_selesai: data.tanggal_selesai || "",
      });
      const rumah = dataRumah.find((r) => r.id === data.rumah_id) || data.rumah || null;
      const penghuni = dataPenghuni.find((p) => p.id === data.penghuni_id) || data.penghuni || null;
      setSelectedRumah(rumah);
      setSelectedPenghuni(penghuni);
    } else {
      setFormData({
        rumah_id: "",
        penghuni_id: "",
        tanggal_mulai: new Date().toISOString().split("T")[0],
        tanggal_selesai: "",
      });
      setSelectedRumah(null);
      setSelectedPenghuni(null);
    }
    setErrors({});
  }, [data, open, dataRumah, dataPenghuni]);

  const handleRumahChange = (value) => {
    setFormData((prev) => ({ ...prev, rumah_id: value }));
    const rumah = dataRumah.find((r) => String(r.id) === value);
    setSelectedRumah(rumah || null);
    if (errors.rumah_id) setErrors((prev) => ({ ...prev, rumah_id: "" }));
  };

  const handlePenghuniChange = (value) => {
    setFormData((prev) => ({ ...prev, penghuni_id: value }));
    const penghuni = dataPenghuni.find((p) => String(p.id) === value);
    setSelectedPenghuni(penghuni || null);
    if (errors.penghuni_id) setErrors((prev) => ({ ...prev, penghuni_id: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.rumah_id) newErrors.rumah_id = "Pilih rumah";
    if (!formData.penghuni_id) newErrors.penghuni_id = "Pilih penghuni";
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        rumah_id: Number(formData.rumah_id),
        penghuni_id: Number(formData.penghuni_id),
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai || null,
      };

      if (isEdit) {
        await update(data.id, payload);
      } else {
        await store(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("error saving data", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Hunian" : "Tambah Hunian"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Pilih Rumah */}
          <div className="space-y-2">
            <Label>Step 1: Pilih Rumah</Label>
            <Select value={formData.rumah_id} onValueChange={handleRumahChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Rumah" />
              </SelectTrigger>
              <SelectContent>
                {dataRumah.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.nomor_rumah} - {item.alamat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rumah_id && <p className="text-sm text-red-500">{errors.rumah_id}</p>}
            {selectedRumah && (
              <div className="ml-1 text-sm text-muted-foreground space-y-0.5">
                <p>→ Alamat: {selectedRumah.alamat}</p>
                <p>→ Kategori: {selectedRumah.kategori}</p>
              </div>
            )}
          </div>

          {/* Step 2: Pilih Penghuni */}
          <div className="space-y-2">
            <Label>Step 2: Pilih Penghuni</Label>
            <Select value={formData.penghuni_id} onValueChange={handlePenghuniChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Penghuni" />
              </SelectTrigger>
              <SelectContent>
                {dataPenghuni.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.nama_lengkap}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.penghuni_id && <p className="text-sm text-red-500">{errors.penghuni_id}</p>}
            {selectedPenghuni && (
              <div className="ml-1 text-sm text-muted-foreground space-y-0.5">
                <p>→ No Telepon: {selectedPenghuni.no_telepon}</p>
                <p>→ Status: {selectedPenghuni.status_penghuni}</p>
                <p>→ Pernikahan: {selectedPenghuni.status_pernikahan}</p>
                {selectedPenghuni.foto_ktp && (
                  <div className="mt-2">
                    <img
                      src={`${STORAGE_BASE}${selectedPenghuni.foto_ktp}`}
                      alt="Foto KTP"
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Detail Hunian */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Step 3: Detail Hunian</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <DatePicker
                  value={formData.tanggal_mulai}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, tanggal_mulai: value }));
                    if (errors.tanggal_mulai) setErrors((prev) => ({ ...prev, tanggal_mulai: "" }));
                  }}
                  placeholder="Pilih tanggal mulai"
                />
                {errors.tanggal_mulai && <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>}
              </div>
              <div className="space-y-2">
                <Label>Tanggal Selesai</Label>
                <DatePicker
                  value={formData.tanggal_selesai}
                  onChange={(value) => setFormData((prev) => ({ ...prev, tanggal_selesai: value }))}
                  placeholder="Pilih tanggal selesai"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
