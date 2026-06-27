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
import { destroyRumah, index, show } from "@/services/mstRumahService";
import { Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormRumah from "./Form";
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

export default function ListRumah() {
  const [rumah, setRumah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShow, setLoadingShow] = useState(false);
  const [search, setSearch] = useState("");
  const [debbounceSearch, setDebounceSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);

  // delete state
  const [openDelete, setOpenDelete] = useState(false);
  const [rumahToDelete, setRumahToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const formatKategori = (kategori) => {
    if (kategori === "tetap") return "Tetap";
    if (kategori === "non_tetap") return "Non Tetap";
    return "";
  };

  const handleAdd = () => {
    setSelectedRumah(null);
    setOpenModal(true);
  };

  const handleEdit = async (id) => {
    try {
      setLoadingShow(true);
      const response = await show(id);
      setSelectedRumah(response.data?.data || response.data);
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
      setRumahToDelete(response.data?.data || response.data);
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
      await destroyRumah(rumahToDelete.id);
      setOpenDelete(false);
      setRumahToDelete(null);
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
      const response = await index(page, 10, debbounceSearch, selectedKategori);
      const data = response.data.data || [];
      setRumah(data);
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
  }, [page, debbounceSearch, selectedKategori]);

  const filteredRumah = (rumah || []).filter((rumah) =>
    rumah.nomor_rumah?.toLowerCase().includes(search.toLowerCase()) ||
    rumah.alamat?.toLowerCase().includes(search.toLowerCase()) ||
    formatKategori(rumah.kategori).toLowerCase().includes(search.toLowerCase())
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
            Master Rumah
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={() => handleAdd()}
          >
            <Plus className="h-4 w-4"></Plus>
            Tambah Rumah
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground"></Search>
            <Input
              placeholder="Search rumah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            ></Input>
            <Select
              value={selectedKategori || "all"}
              onValueChange={(value) => {
                setSelectedKategori(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="non_tetap">Non Tetap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Rumah</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRumah.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                filteredRumah.map((rumah, index) => (
                  <TableRow key={rumah.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{rumah.nomor_rumah}</TableCell>
                    <TableCell>{rumah.alamat}</TableCell>
                    <TableCell>{formatKategori(rumah.kategori)}</TableCell>
                    <TableCell>
                      {rumah.status_rumah === 'dihuni' ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Dihuni</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Tidak Dihuni</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(rumah.created_at)}</TableCell>
                    <TableCell>{formatDate(rumah.updated_at)}</TableCell>
                    <TableCell className="justify-content-between flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rumah.id)}
                        disabled={loadingShow}
                      >
                        <Pen className="h-4 w-4"></Pen>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(rumah.id)}
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

      <FormRumah
        key={openModal ? (selectedRumah ? `edit-${selectedRumah.id}` : "create") : "closed"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        rumah={selectedRumah}
        onSuccess={fetchData}
      ></FormRumah>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Rumah{" "}
              <span className="font-semibold">
                {rumahToDelete?.alamat}-{rumahToDelete?.nomor_rumah}
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
