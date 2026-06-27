import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, getUsers, getUsersById } from "@/services/mstUserservice";
import { Eye, Pen, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShow, setLoadingShow] = useState(false);
  const [search, setSearch] = useState("");
  const [debbounceSearch, setDebounceSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // view state
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  // delete state
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleView = async (id) => {
    try {
      setLoadingShow(true);
      const response = await getUsersById(id);
      setViewData(response.data);
      setOpenView(true);
    } catch (error) {
      console.error("error fetch data", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoadingShow(true);
      const response = await getUsersById(id);
      setSelectedUser(response.data);
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
      const response = await getUsersById(id);
      setUserToDelete(response.data);
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
      await deleteUser(userToDelete.id);
      setOpenDelete(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(page, 10, debbounceSearch, selectedRole);
      const userData = response.data.data || [];
      setUsers(userData);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error("Error:", error);
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
    fetchUsers();
  }, [page, debbounceSearch, selectedRole]);

  const filteredUsers = (users || []).filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
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
      <Breadcrumbs />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Master Users
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 border-dashed hover:border-solid hover:bg-accent rounded-md"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground"></Search>
            <Input
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="rt">RT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
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
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className={"text-center"}>
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role === 'rt' ? 'RT' : 'Admin'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.updated_at)}</TableCell>
                    <TableCell className="justify-content-between flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(user.id)}
                        disabled={loadingShow}
                      >
                        <Eye className="h-4 w-4"></Eye>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                        disabled={loadingShow}
                      >
                        <Pen className="h-4 w-4"></Pen>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                        disabled={loadingShow}
                      >
                        <Trash2 className="h-4 w-4" />
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

      <UserForm
        key={openModal ? (selectedUser ? `edit-${selectedUser.id}` : "create") : "closed"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      ></UserForm>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              User <span className="font-semibold">{userToDelete?.name}</span>{" "}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{viewData.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{viewData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-sm">{viewData.role === 'rt' ? 'RT' : 'Admin'}</p>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
