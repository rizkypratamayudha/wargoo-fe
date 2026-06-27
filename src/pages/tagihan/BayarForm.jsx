import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { bayar } from "@/services/trTagihanService";
import { useState } from "react";
import { toast } from "sonner";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function BayarForm({ open, onClose, data, onSuccess }) {
  const [tanggalBayar, setTanggalBayar] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!tanggalBayar) {
      setErrors({ tanggal_bayar: "Tanggal bayar wajib diisi" });
      return;
    }

    try {
      setLoading(true);
      await bayar(data.id, { tanggal_bayar: tanggalBayar });
      toast.success("Berhasil", { description: "Pembayaran telah dikonfirmasi." });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("error bayar", error);
      if (error.response?.data?.message) {
        toast.error("Gagal", { description: error.response.data.message });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rumah</span>
              <span className="font-medium">{data.rumah?.nomor_rumah || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Penghuni</span>
              <span className="font-medium">{data.penghuni?.nama_lengkap || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jenis Iuran</span>
              <span className="font-medium">{data.jenis_iuran?.nama || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nominal</span>
              <span className="font-medium">{formatRupiah(data.nominal)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tanggal Bayar</Label>
            <DatePicker
              value={tanggalBayar}
              onChange={(val) => {
                setTanggalBayar(val);
                if (errors.tanggal_bayar) setErrors((prev) => ({ ...prev, tanggal_bayar: "" }));
              }}
            />
            {errors.tanggal_bayar && <p className="text-sm text-red-500">{errors.tanggal_bayar}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Memproses..." : "Konfirmasi Bayar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
