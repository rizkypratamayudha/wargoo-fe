import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, update } from "@/services/mstKategoriPengeluaranService";
import { useEffect, useState } from "react";

export default function FormKategoriPengeluaran({ open, onClose, data, onSuccess }) {
  const [formData, setFormData] = useState({
    nama: "",
    tipe: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setFormData({
        nama: data.nama || "",
        tipe: data.tipe || "",
      });
    } else {
      setFormData({
        nama: "",
        tipe: "",
      });
    }
    setErrors({});
  }, [data, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama) newErrors.nama = "Nama Kategori is required";
    if (!formData.tipe) newErrors.tipe = "Tipe is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await update(data.id, formData);
      } else {
        await store(formData);
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
          <DialogTitle>{isEdit ? "Edit Kategori Pengeluaran" : "Create Kategori Pengeluaran"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kategori</Label>
            <Input
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Enter Nama Kategori"
            />
            {errors.nama && (
              <p className="text-sm text-red-500">{errors.nama}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipe">Tipe</Label>
            <Select
              value={formData.tipe}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, tipe: value }));
                if (errors.tipe)
                  setErrors((prev) => ({ ...prev, tipe: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tipe"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rutin">Rutin</SelectItem>
                <SelectItem value="tidak_rutin">Tidak Rutin</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipe && (
              <p className="text-sm text-red-500">{errors.tipe}</p>
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
