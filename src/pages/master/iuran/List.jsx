import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { destroyIuran, index, show } from "@/services/mstJenisIuranService";
import { formatRupiah } from "@/lib/utils";
import { Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormIuran from "./Form";
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

export default function ListIuran() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  // search
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // delete state
  const [openDelete, setOpenDelete] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAdd = () => {
    setSelectedData(null);
    setOpenModal(true);
  };

  const handleEdit = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setSelectedData(response.data?.data || response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setDataToDelete(response.data?.data || response.data);
      setOpenDelete(true);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await destroyIuran(dataToDelete.id);
      setOpenDelete(false);
      setDataToDelete(null);
      fetchData();
    } catch (error) {
      console.error("error delete data", error);
    } finally {
      setDeleting(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await index(page, 10, debounceSearch);
      const result = response.data.data || [];
      setData(result);
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

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debounceSearch]);

  const filteredData = (data || []).filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
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
            Master Iuran
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={() => handleAdd()}
          >
            <Plus className="h-4 w-4"></Plus>
            Tambah Iuran
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground"></Search>
            <Input
              placeholder="Search Iuran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            ></Input>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Iuran</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{formatRupiah(item.nominal)}</TableCell>
                    <TableCell>{item.periode}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>{formatDate(item.updated_at)}</TableCell>
                    <TableCell className="justify-content-between flex gap-2">
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

      <FormIuran
        key={openModal ? (selectedData ? `edit-${selectedData.id}` : "create") : "closed"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedData}
        onSuccess={fetchData}
      ></FormIuran>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Iuran{" "}
              <span className="font-semibold">
                {dataToDelete?.nama}
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
    </div>
  );
}
