import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getSummary, getDetail } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await getSummary(year);
      setSummary(response.data);
    } catch (error) {
      console.error("error fetch dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = async (bulanAngka) => {
    try {
      setLoadingDetail(true);
      const response = await getDetail(year, bulanAngka);
      setDetailData(response.data);
      setOpenDetail(true);
    } catch (error) {
      console.error("error fetch detail", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [year]);

  const chartData = summary?.months?.map((m) => ({
    name: m.bulan.slice(0, 3),
    Pemasukan: m.pemasukan,
    Pengeluaran: m.pengeluaran,
    Saldo: m.saldo,
  })) || [];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setYear((y) => y - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-lg">{year}</span>
          <Button variant="outline" size="icon" onClick={() => setYear((y) => y + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatRupiah(summary?.total_pemasukan || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatRupiah(summary?.total_pengeluaran || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatRupiah(summary?.total_saldo || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatRupiah(value)} />
                  <Legend />
                  <Bar dataKey="Pemasukan" fill="#22c55e" />
                  <Bar dataKey="Pengeluaran" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldo Kumulatif</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatRupiah(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="Saldo" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail per Bulan — {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan</TableHead>
                <TableHead className="text-right">Pemasukan</TableHead>
                <TableHead className="text-right">Pengeluaran</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary?.months?.map((m) => (
                <TableRow key={m.bulan_angka}>
                  <TableCell className="font-medium">{m.bulan}</TableCell>
                  <TableCell className="text-right text-green-600">{formatRupiah(m.pemasukan)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatRupiah(m.pengeluaran)}</TableCell>
                  <TableCell className={`text-right font-medium ${m.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatRupiah(m.saldo)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" onClick={() => handleDetailClick(m.bulan_angka)} disabled={loadingDetail}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail {detailData?.bulan}</DialogTitle>
          </DialogHeader>
          {detailData && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-muted-foreground">Pemasukan</p>
                  <p className="font-bold text-green-600">{formatRupiah(detailData.total_pemasukan)}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-muted-foreground">Pengeluaran</p>
                  <p className="font-bold text-red-600">{formatRupiah(detailData.total_pengeluaran)}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-muted-foreground">Saldo</p>
                  <p className="font-bold text-blue-600">{formatRupiah(detailData.saldo)}</p>
                </div>
              </div>

              {detailData.pemasukan?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-green-700">Pemasukan</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Rumah</TableHead>
                        <TableHead>Penghuni</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailData.pemasukan.map((item) => (
                        <TableRow key={`p-${item.id}`}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>{item.rumah}</TableCell>
                          <TableCell>{item.penghuni}</TableCell>
                          <TableCell>{item.deskripsi}</TableCell>
                          <TableCell className="text-right text-green-600">{formatRupiah(item.nominal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {detailData.pengeluaran?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-700">Pengeluaran</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Dicatat Oleh</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailData.pengeluaran.map((item) => (
                        <TableRow key={`e-${item.id}`}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>{item.kategori}</TableCell>
                          <TableCell>{item.deskripsi}</TableCell>
                          <TableCell>{item.dicatat_oleh}</TableCell>
                          <TableCell className="text-right text-red-600">{formatRupiah(item.nominal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {detailData.pemasukan?.length === 0 && detailData.pengeluaran?.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Tidak ada data untuk bulan ini</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
