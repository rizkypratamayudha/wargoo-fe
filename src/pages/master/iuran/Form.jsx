import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, update } from "@/services/mstJenisIuranService";
import { formatRupiah } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function FormIuran({ open, onClose, data, onSuccess }) {
  const [formData, setFormData] = useState({
    nama: "",
    nominal: 0,
    periode: "",
  });
  const [nominalDisplay, setNominalDisplay] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setFormData({
        nama: data.nama || "",
        nominal: data.nominal || 0,
        periode: data.periode || "",
      });
      setNominalDisplay(formatRupiah(data.nominal || 0));
    } else {
      setFormData({
        nama: "",
        nominal: 0,
        periode: "",
      });
      setNominalDisplay("");
    }
    setErrors({});
  }, [data, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nominal") {
      const raw = value.replace(/[^0-9]/g, "");
      const number = raw ? parseInt(raw, 10) : 0;
      setFormData((prev) => ({ ...prev, nominal: number }));
      setNominalDisplay(number > 0 ? formatRupiah(number) : "");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama) newErrors.nama = "Nama Iuran is required";
    if (!formData.nominal) newErrors.nominal = "Nominal is required";
    if (!formData.periode) newErrors.periode = "Periode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmits = async (e) => {
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
          <DialogTitle>{isEdit ? "Edit Iuran" : "Create Iuran"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmits} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Iuran</Label>
            <Input
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Enter Nama Iuran"
            ></Input>
            {errors.nama && (
              <p className="text-sm text-red-500">{errors.nama}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nominal">Nominal</Label>
            <Input
              id="nominal"
              name="nominal"
              value={nominalDisplay}
              onChange={handleChange}
              placeholder="Rp 0"
            ></Input>
            {errors.nominal && (
              <p className="text-sm text-red-500">{errors.nominal}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periode">Periode</Label>
            <Select
              value={formData.periode}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, periode: value }));
                if (errors.periode)
                  setErrors((prev) => ({ ...prev, periode: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Periode"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulanan">Bulanan</SelectItem>
                <SelectItem value="tahunan">Tahunan</SelectItem>
              </SelectContent>
            </Select>
            {errors.periode && (
              <p className="text-sm text-red-500">{errors.periode}</p>
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
