import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthPicker } from "@/components/ui/month-picker";
import { generate } from "@/services/trTagihanService";
import { indexAll } from "@/services/mstJenisIuranService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function GenerateForm({ open, onClose, onSuccess }) {
  const [periode, setPeriode] = useState("");
  const [jenisIurans, setJenisIurans] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchJenisIuran();
      setPeriode("");
      setSelectedIds([]);
      setErrors({});
    }
  }, [open]);

  const fetchJenisIuran = async () => {
    try {
      setLoadingData(true);
      const response = await indexAll();
      setJenisIurans(response.data || []);
    } catch (error) {
      console.error("error fetch jenis iuran", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleToggleAll = () => {
    if (selectedIds.length === jenisIurans.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jenisIurans.map((item) => item.id));
    }
  };

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!periode) newErrors.periode = "Pilih periode";
    if (selectedIds.length === 0) newErrors.jenis_iuran = "Pilih minimal satu jenis iuran";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await generate({
        periode: periode + "-01",
        jenis_iuran_ids: selectedIds,
      });
      toast.success("Berhasil", { description: response.message });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("error generate", error);
      if (error.response?.data?.message) {
        toast.error("Gagal", { description: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Tagihan</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Periode</Label>
            <MonthPicker
              value={periode}
              onChange={(val) => {
                setPeriode(val);
                if (errors.periode) setErrors((prev) => ({ ...prev, periode: "" }));
              }}
            />
            {errors.periode && <p className="text-sm text-red-500">{errors.periode}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Jenis Iuran</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleToggleAll}
                className="h-6 text-xs"
              >
                {selectedIds.length === jenisIurans.length ? "Batal Pilih" : "Pilih Semua"}
              </Button>
            </div>
            {loadingData ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2 border rounded-md p-3">
                {jenisIurans.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`iuran-${item.id}`}
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleToggle(item.id)}
                      />
                      <Label htmlFor={`iuran-${item.id}`} className="cursor-pointer">
                        {item.nama}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatRupiah(item.nominal)} / {item.periode}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {errors.jenis_iuran && <p className="text-sm text-red-500">{errors.jenis_iuran}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Generating..." : "Generate Tagihan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
