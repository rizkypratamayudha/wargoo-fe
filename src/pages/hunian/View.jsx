import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_URL } from "@/config";

const STORAGE_BASE = API_URL.replace(/\/api\/?$/, "") + "/storage/";

export default function ViewHunian({ open, onClose, data }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (item) => {
    const status = item.computed_status;

    const statusMap = {
      aktif: { label: "Aktif", className: "bg-green-100 text-green-700 border-green-200" },
      tidak_aktif: { label: "Tidak Aktif", className: "bg-gray-100 text-gray-700 border-gray-200" },
      berakhir: { label: "Berakhir", className: "bg-red-100 text-red-700 border-red-200" },
      mendekati_berakhir: { label: "Mendekati Berakhir", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    };

    return statusMap[status] || statusMap.aktif;
  };

  const rumah = data.rumah || {};
  const penghuni = data.penghuni || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Hunian</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Informasi Rumah */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Informasi Rumah</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor Rumah</span>
                <span className="font-medium">{rumah.nomor_rumah || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alamat</span>
                <span className="font-medium text-right max-w-[250px]">{rumah.alamat || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kategori</span>
                <span className="font-medium">{rumah.kategori === 'non_tetap' ? 'Non tetap' : 'Tetap'}</span>
              </div>
            </div>
          </div>

          {/* Informasi Penghuni */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Informasi Penghuni</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama Lengkap</span>
                <span className="font-medium">{penghuni.nama_lengkap || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">No Telepon</span>
                <span className="font-medium">{penghuni.no_telepon || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status Penghuni</span>
                <span className="font-medium">{penghuni.status_penghuni || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status Pernikahan</span>
                <span className="font-medium">{penghuni.status_pernikahan || "-"}</span>
              </div>
              {penghuni.foto_ktp && (
                <div className="mt-2">
                  <p className="text-muted-foreground mb-1">Foto KTP</p>
                  <img
                    src={`${STORAGE_BASE}${penghuni.foto_ktp}`}
                    alt="Foto KTP"
                    className="w-40 h-24 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Detail Hunian */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Detail Hunian</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Mulai</span>
                <span className="font-medium">{formatDate(data.tanggal_mulai)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Selesai</span>
                <span className="font-medium">{formatDate(data.tanggal_selesai)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={getStatusBadge(data).className}>
                  {getStatusBadge(data).label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
