import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { destroyPenghuni, index, show } from "@/services/mstPenghuniService";
import { API_URL } from "@/config";
import { Eye, Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormPenghuni from "./Form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_BASE = API_URL.replace(/\/api\/?$/, "") + "/storage/";

export default function ListPenghuni() {
  const [penghuni, setPenghuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShow, setLoadingShow] = useState(false);
  const [search, setSearch] = useState("");
  const [debbounceSearch, setDebounceSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [penghuniToDelete, setPenghuniToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const formatStatus = (status) => {
    if (status === "tetap") return "Tetap";
    if (status === "kontrak") return "Kontrak";
    return "";
  };

  const formatPernikahan = (status) => {
    if (status === "menikah") return "Menikah";
    if (status === "belum_menikah") return "Belum Menikah";
    return "";
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return `${STORAGE_BASE}${path}`;
  };

  const handleAdd = () => {
    setSelectedPenghuni(null);
    setOpenModal(true);
  };

  const handleView = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setViewData(response.data?.data || response.data);
      setOpenView(true);
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      const result = response.data?.data || response.data;
      setSelectedPenghuni(result);
      setOpenModal(true);
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      const result = response.data?.data || response.data;
      setPenghuniToDelete(result);
      setOpenDelete(true);
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await destroyPenghuni(penghuniToDelete.id);
      setOpenDelete(false);
      setPenghuniToDelete(null);
      fetchData();
    } catch (error) {
      console.error("error deleting data", error);
    } finally {
      setDeleting(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await index(page, 10, debbounceSearch, selectedStatus);
      const data = response.data.data || [];
      setPenghuni(data);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debbounceSearch, selectedStatus]);

  const filteredPenghuni = (penghuni || []).filter((item) =>
    item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    item.no_telepon?.toLowerCase().includes(search.toLowerCase()) ||
    formatStatus(item.status_penghuni).toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <Breadcrumbs></Breadcrumbs>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Master Penghuni
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={() => handleAdd()}
          >
            <Plus className="h-4 w-4"></Plus>
            Tambah Penghuni
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground"></Search>
            <Input
              placeholder="Search nama atau no telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            ></Input>
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => {
                setSelectedStatus(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="kontrak">Kontrak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Foto KTP</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>No Telepon</TableHead>
                <TableHead>Status Penghuni</TableHead>
                <TableHead>Status Pernikahan</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPenghuni.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                filteredPenghuni.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>
                      {item.foto_ktp ? (
                        <img
                          src={getImageUrl(item.foto_ktp)}
                          alt="Foto KTP"
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{item.nama_lengkap}</TableCell>
                    <TableCell>{item.no_telepon}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        item.status_penghuni === "tetap"
                          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                      }`}>
                        {formatStatus(item.status_penghuni)}
                      </span>
                    </TableCell>
                    <TableCell>{formatPernikahan(item.status_pernikahan)}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>{formatDate(item.updated_at)}</TableCell>
                    <TableCell className="justify-content-between flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(item.id)}
                        disabled={loadingShow}
                      >
                        <Eye className="h-4 w-4"></Eye>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                        disabled={loadingShow}
                      >
                        <Pen className="h-4 w-4"></Pen>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                        disabled={loadingShow}
                      >
                        <Trash2 className="h-4 w-4"></Trash2>
                      </Button>
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
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <FormPenghuni
        key={openModal ? (selectedPenghuni ? `edit-${selectedPenghuni.id}` : "create") : "closed"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        penghuni={selectedPenghuni}
        onSuccess={fetchData}
      ></FormPenghuni>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Penghuni{" "}
              <span className="font-semibold">
                {penghuniToDelete?.nama_lengkap}
              </span>{" "}
              akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Penghuni</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-4">
              {viewData.foto_ktp && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Foto KTP</p>
                  <img
                    src={getImageUrl(viewData.foto_ktp)}
                    alt="Foto KTP"
                    className="w-full max-w-xs rounded border"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                  <p className="text-sm">{viewData.nama_lengkap}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">No Telepon</p>
                  <p className="text-sm">{viewData.no_telepon}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status Penghuni</p>
                  <p className="text-sm">{formatStatus(viewData.status_penghuni)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status Pernikahan</p>
                  <p className="text-sm">{formatPernikahan(viewData.status_pernikahan)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">{formatDate(viewData.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-sm">{formatDate(viewData.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
