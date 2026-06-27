import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { index, show, destroy, batalBayar } from "@/services/trTagihanService";
import { MonthPicker } from "@/components/ui/month-picker";
import { Eye, Plus, Search, Trash2, CreditCard, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import GenerateForm from "./GenerateForm";
import BayarForm from "./BayarForm";
import ViewDetail from "./ViewDetail";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPeriode(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export default function ListTagihan() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openBayar, setOpenBayar] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");

  const handleView = async (id) => {
    try {
      setLoadingAction(true);
      const response = await show(id);
      setSelectedData(response.data?.data || response.data);
      setOpenView(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleBayar = async (id) => {
    try {
      setLoadingAction(true);
      const response = await show(id);
      setSelectedData(response.data?.data || response.data);
      setOpenBayar(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleBatalBayar = async (id) => {
    try {
      setLoadingAction(true);
      await batalBayar(id);
      fetchData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoadingAction(true);
      await destroy(selectedData.id);
      setOpenDelete(false);
      setSelectedData(null);
      fetchData();
    } catch (error) {
      console.log("error deleting", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await index(page, 10, debounceSearch, selectedStatus, selectedPeriode);
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
  }, [page, debounceSearch, selectedStatus, selectedPeriode]);

  return (
    <div className="p-4">
      <Breadcrumbs />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Data Tagihan
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={() => setOpenGenerate(true)}
          >
            <Plus className="h-4 w-4" />
            Generate Tagihan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari rumah / penghuni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm shrink-0"
            />
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => {
                setSelectedStatus(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
              </SelectContent>
            </Select>
            <MonthPicker
              value={selectedPeriode ? selectedPeriode.replace("-01", "") : ""}
              onChange={(val) => {
                setSelectedPeriode(val ? val + "-01" : "");
                setPage(1);
              }}
              className="w-[180px] shrink-0"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Rumah</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Jenis Iuran</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{item.rumah?.nomor_rumah || "-"}</TableCell>
                    <TableCell>{item.penghuni?.nama_lengkap || "-"}</TableCell>
                    <TableCell>{item.jenis_iuran?.nama || "-"}</TableCell>
                    <TableCell>{formatPeriode(item.periode)}</TableCell>
                    <TableCell className="text-right">{formatRupiah(item.nominal)}</TableCell>
                    <TableCell>
                      {item.status === "lunas" ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Lunas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          Belum Lunas
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(item.id)}
                          disabled={loadingAction}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status === "belum_lunas" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleBayar(item.id)}
                            disabled={loadingAction}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => handleBatalBayar(item.id)}
                            disabled={loadingAction}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item)}
                          disabled={loadingAction}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <GenerateForm
        open={openGenerate}
        onClose={() => setOpenGenerate(false)}
        onSuccess={() => {
          fetchData();
          setPage(1);
        }}
      />

      <BayarForm
        open={openBayar}
        onClose={() => setOpenBayar(false)}
        data={selectedData}
        onSuccess={fetchData}
      />

      <ViewDetail
        open={openView}
        onClose={() => setOpenView(false)}
        data={selectedData}
      />

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data tagihan akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingAction}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loadingAction}
              className="bg-red-500 hover:bg-red-600"
            >
              {loadingAction ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
