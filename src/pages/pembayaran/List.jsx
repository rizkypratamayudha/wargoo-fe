import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
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
import { index, show } from "@/services/trPembayaranService";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function ListPembayaran() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleView = async (id) => {
    try {
      setLoadingDetail(true);
      const response = await show(id);
      setSelectedData(response.data);
      setOpenDetail(true);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await index(page, 10, debounceSearch, tanggalAwal, tanggalAkhir);
      setData(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debounceSearch, tanggalAwal, tanggalAkhir]);

  return (
    <div className="p-4">
      <Breadcrumbs />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Data Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari rumah / penghuni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs shrink-0"
            />
            <div className="flex items-center gap-1 shrink-0">
              <DatePicker
                value={tanggalAwal}
                onChange={setTanggalAwal}
                placeholder="Dari tanggal"
                className="w-[160px]"
              />
              <span className="text-muted-foreground text-sm">s/d</span>
              <DatePicker
                value={tanggalAkhir}
                onChange={setTanggalAkhir}
                placeholder="Sampai tanggal"
                className="w-[160px]"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Rumah</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead className="text-right">Total Bayar</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{formatDate(item.tanggal_bayar)}</TableCell>
                    <TableCell>{item.rumah?.nomor_rumah || "-"}</TableCell>
                    <TableCell>{item.penghuni?.nama_lengkap || "-"}</TableCell>
                    <TableCell className="text-right">{formatRupiah(item.total_bayar)}</TableCell>
                    <TableCell>{item.user?.name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(item.id)}
                          disabled={loadingDetail}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedData && (
            <div className="space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Bayar</span>
                  <span className="font-medium">{formatDate(selectedData.tanggal_bayar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rumah</span>
                  <span className="font-medium">{selectedData.rumah?.nomor_rumah || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penghuni</span>
                  <span className="font-medium">{selectedData.penghuni?.nama_lengkap || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dicatat Oleh</span>
                  <span className="font-medium">{selectedData.user?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Keterangan</span>
                  <span className="font-medium">{selectedData.keterangan || "-"}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 mt-1.5">
                  <span className="text-muted-foreground">Total Bayar</span>
                  <span className="font-bold">{formatRupiah(selectedData.total_bayar)}</span>
                </div>
              </div>

              {selectedData.tagihan && selectedData.tagihan.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tagihan Terkait</p>
                  <div className="border rounded-md p-3 space-y-2">
                    {selectedData.tagihan.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span>{t.jenis_iuran?.nama || "-"}</span>
                          <span className="text-muted-foreground ml-2">({t.periode_label})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{formatRupiah(t.nominal)}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Lunas
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
