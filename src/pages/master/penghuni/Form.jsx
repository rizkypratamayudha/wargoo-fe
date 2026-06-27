import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, update } from "@/services/mstPenghuniService";
import { API_URL } from "@/config";
import { useEffect, useState } from "react";

const STORAGE_BASE = API_URL.replace(/\/api\/?$/, "") + "/storage/";

export default function FormPenghuni({ open, onClose, penghuni, onSuccess }) {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    foto_ktp: null,
    status_penghuni: "",
    no_telepon: "",
    status_pernikahan: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const isEdit = !!penghuni;

  useEffect(() => {
    if (penghuni) {
      setFormData({
        nama_lengkap: penghuni.nama_lengkap || "",
        foto_ktp: null,
        status_penghuni: penghuni.status_penghuni || "",
        no_telepon: penghuni.no_telepon || "",
        status_pernikahan: penghuni.status_pernikahan || "",
      });
      if (penghuni.foto_ktp) {
        setPreviewImage(`${STORAGE_BASE}${penghuni.foto_ktp}`);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({
        nama_lengkap: "",
        foto_ktp: null,
        status_penghuni: "",
        no_telepon: "",
        status_pernikahan: "",
      });
      setPreviewImage(null);
    }
    setErrors({});
  }, [penghuni, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto_ktp: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.foto_ktp) {
        setErrors((prev) => ({ ...prev, foto_ktp: "" }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama_lengkap) newErrors.nama_lengkap = "Nama lengkap is required";
    if (!formData.status_penghuni) newErrors.status_penghuni = "Status penghuni is required";
    if (!formData.no_telepon) newErrors.no_telepon = "No telepon is required";
    if (!formData.status_pernikahan) newErrors.status_pernikahan = "Status pernikahan is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEdit) {
        const submitData = new FormData();
        submitData.append("_method", "PUT");
        submitData.append("nama_lengkap", formData.nama_lengkap);
        submitData.append("status_penghuni", formData.status_penghuni);
        submitData.append("no_telepon", formData.no_telepon);
        submitData.append("status_pernikahan", formData.status_pernikahan);
        if (formData.foto_ktp instanceof File) {
          submitData.append("foto_ktp", formData.foto_ktp);
        }
        await update(penghuni.id, submitData);
      } else {
        const submitData = new FormData();
        submitData.append("nama_lengkap", formData.nama_lengkap);
        submitData.append("status_penghuni", formData.status_penghuni);
        submitData.append("no_telepon", formData.no_telepon);
        submitData.append("status_pernikahan", formData.status_pernikahan);
        if (formData.foto_ktp) {
          submitData.append("foto_ktp", formData.foto_ktp);
        }
        await store(submitData);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Penghuni" : "Create Penghuni"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <Input
              id="nama_lengkap"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Enter nama lengkap"
            ></Input>
            {errors.nama_lengkap && (
              <p className="text-sm text-red-500">{errors.nama_lengkap}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="no_telepon">No Telepon</Label>
            <Input
              id="no_telepon"
              name="no_telepon"
              value={formData.no_telepon}
              onChange={handleChange}
              placeholder="Enter no telepon"
              type={"number"}
            ></Input>
            {errors.no_telepon && (
              <p className="text-sm text-red-500">{errors.no_telepon}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status_penghuni">Status Penghuni</Label>
            <Select
              value={formData.status_penghuni}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, status_penghuni: value }));
                if (errors.status_penghuni) setErrors((prev) => ({ ...prev, status_penghuni: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status penghuni"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="kontrak">Kontrak</SelectItem>
              </SelectContent>
            </Select>
            {errors.status_penghuni && (
              <p className="text-sm text-red-500">{errors.status_penghuni}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status_pernikahan">Status Pernikahan</Label>
            <Select
              value={formData.status_pernikahan}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, status_pernikahan: value }));
                if (errors.status_pernikahan) setErrors((prev) => ({ ...prev, status_pernikahan: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status pernikahan"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menikah">Menikah</SelectItem>
                <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
              </SelectContent>
            </Select>
            {errors.status_pernikahan && (
              <p className="text-sm text-red-500">{errors.status_pernikahan}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto_ktp">Foto KTP</Label>
            <Input
              id="foto_ktp"
              name="foto_ktp"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
            ></Input>
            {errors.foto_ktp && (
              <p className="text-sm text-red-500">{errors.foto_ktp}</p>
            )}
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview KTP"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
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
