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
import { indexAll as indexAllPenghuni } from "@/services/mstPenghuniService";
import { indexAll } from "@/services/mstRumahService";
import {
  destroyPenghuni,
  indexRumahPenghuni,
  show,
} from "@/services/trRumahPenghuniService";
import { Eye, Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormHunian from "./Form";
import ViewHunian from "./View";

export default function ListHunian() {
  const [data, setData] = useState([]);
  const [dataRumah, setDataRumah] = useState([]);
  const [dataPenghuni, setDataPenghuni] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const handleAdd = () => {
    setSelectedData(null);
    setOpenModal(true);
  };

  const handleView = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setViewData(response.data?.data || response.data);
      setOpenView(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setSelectedData(response.data?.data || response.data);
      setOpenModal(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleDelete = async (id) => {
    setSelectedData({ id });
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await destroyPenghuni(selectedData.id);
      setOpenDelete(false);
      setSelectedData(null);
      fetchHunian();
    } catch (error) {
      console.log("error deleting", error);
    } finally {
      setDeleting(false);
    }
  };

  const fetchHunian = async () => {
    setLoading(true);
    try {
      const resHunian = await indexRumahPenghuni(
        page,
        10,
        debounceSearch,
        selectedStatus,
      );
      setData(resHunian.data.data || []);
      setTotalPages(resHunian.data.last_page || 1);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [resRumah, resPenghuni] = await Promise.all([
        indexAll(),
        indexAllPenghuni(),
      ]);
      setDataRumah(resRumah.data || []);
      setDataPenghuni(resPenghuni.data || []);
    } catch (error) {
      console.error("error fetch master data", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchHunian();
  }, [page, debounceSearch, selectedStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateCreatedat = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (item) => {
    const status = item.computed_status;

    const statusMap = {
      aktif: {
        label: "Aktif",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      tidak_aktif: {
        label: "Tidak Aktif",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
      berakhir: {
        label: "Berakhir",
        className: "bg-red-100 text-red-700 border-red-200",
      },
      mendekati_berakhir: {
        label: "Mendekati Berakhir",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
    };

    return statusMap[status] || statusMap.aktif;
  };

  return (
    <div className="p-4">
      <Breadcrumbs />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Data Hunian
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari rumah / penghuni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
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
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="berakhir">Berakhir</SelectItem>
                <SelectItem value="mendekati_berakhir">
                  Mendekati Berakhir
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Rumah</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
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
                    <TableCell className="max-w-[200px] truncate">
                      {item.rumah?.alamat || "-"}
                    </TableCell>
                    <TableCell>{item.penghuni?.nama_lengkap || "-"}</TableCell>
                    <TableCell>{formatDate(item.tanggal_mulai)}</TableCell>
                    <TableCell>{formatDate(item.tanggal_selesai)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(item).className}
                      >
                        {getStatusBadge(item).label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateCreatedat(item.created_at)}</TableCell>
                    <TableCell>{formatDateCreatedat(item.updated_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(item.id)}
                          disabled={loadingShow}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          disabled={loadingShow}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                          disabled={loadingShow}
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

      <FormHunian
        key={
          openModal
            ? selectedData
              ? `edit-${selectedData.id}`
              : "create"
            : "closed"
        }
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedData}
        onSuccess={() => {
          fetchHunian();
          setPage(1);
        }}
        dataRumah={dataRumah}
        dataPenghuni={dataPenghuni}
      />

      <ViewHunian
        open={openView}
        onClose={() => setOpenView(false)}
        data={viewData}
      />

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data hunian akan dihapus secara permanen.
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
    </div>
  );
}
