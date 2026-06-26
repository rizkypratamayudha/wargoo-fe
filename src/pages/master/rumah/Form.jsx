import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, update } from "@/services/mstRumahService";
import { useEffect, useState } from "react";

export default function FormRumah({ open, onClose, rumah, onSuccess }) {
  const [formData, setFormData] = useState({
    nomor_rumah: "",
    alamat: "",
    kategori: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!rumah;

  useEffect(() => {
    if (rumah) {
      setFormData({
        nomor_rumah: rumah.nomor_rumah || "",
        alamat: rumah.alamat || "",
        kategori: rumah.kategori || "",
      });
    } else {
      setFormData({
        nomor_rumah: "",
        alamat: "",
        kategori: "",
      });
    }
    setErrors({});
  }, [rumah, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nomor_rumah)
      newErrors.nomor_rumah = "Nomor rumah is required";
    if (!formData.alamat) newErrors.alamat = "Alamat is required";
    if (!formData.kategori) newErrors.kategori = "Kategori is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmits = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await update(rumah.id, formData);
      } else {
        await store(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("error savind data", error);
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
          <DialogTitle>{isEdit ? "Edit Rumah" : "Create Rumah"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmits} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomor_rumah">Nomor Rumah</Label>
            <Input
              id="nomor_rumah"
              name="nomor_rumah"
              value={formData.nomor_rumah}
              onChange={handleChange}
              placeholder="Enter Nomor Rumah"
              type="number"
            ></Input>
            {errors.nomor_rumah && (
              <p className="text-sm text-red-500">{errors.nomor_rumah}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Enter alamat"
            ></Input>
            {errors.alamat && (
              <p className="text-sm text-red-500">{errors.alamat}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Select
              value={formData.kategori}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, kategori: value }));
                if (errors.kategori) setErrors((prev) => ({ ...prev, kategori: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select kategori"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="non_tetap">Non Tetap</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategori && (
              <p className="text-sm text-red-500">{errors.kategori}</p>
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
