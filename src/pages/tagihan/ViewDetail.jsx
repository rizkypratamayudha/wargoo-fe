import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

function formatPeriode(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export default function ViewDetail({ open, onClose, data }) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Detail Tagihan</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Informasi Tagihan</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rumah</span>
                <span className="font-medium">{data.rumah?.nomor_rumah || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alamat</span>
                <span className="font-medium text-right max-w-[250px]">{data.rumah?.alamat || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Penghuni</span>
                <span className="font-medium">{data.penghuni?.nama_lengkap || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis Iuran</span>
                <span className="font-medium">{data.jenis_iuran?.nama || "-"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Detail Pembayaran</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Periode</span>
                <span className="font-medium">{formatPeriode(data.periode)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominal</span>
                <span className="font-medium">{formatRupiah(data.nominal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                {data.status === "lunas" ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    Lunas
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                    Belum Lunas
                  </Badge>
                )}
              </div>
              {data.status === "lunas" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Bayar</span>
                  <span className="font-medium">{formatDate(data.tanggal_bayar)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span className="font-medium">{formatDate(data.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
