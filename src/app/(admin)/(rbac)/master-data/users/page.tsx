"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import type { User } from "@/features/rbac/user/types";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  usePermissions,
} from "@/features/rbac/user/hooks/use-user";
import { useRoles } from "@/features/rbac/role/hooks/use-role";

const inputCls = "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

const roleColors: Record<string, string> = {
  Administrator: "bg-blue-100 text-blue-700",
  User: "bg-muted text-muted-foreground",
  Kasir: "bg-green-100 text-green-700",
  Manajer: "bg-purple-100 text-purple-700",
  Pelayan: "bg-orange-100 text-orange-700",
  Koki: "bg-cyan-100 text-cyan-700",
};

export default function UsersPage() {
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const { add } = useNotification();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const permissions = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState<number>(0);

  const openCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRoleId(roles[0]?.id || 0);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormRoleId(user.role_id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formEmail.trim() || formRoleId === 0) return;
    if (!editingUser && !formPassword.trim()) return;
    
    try {
      if (editingUser) {
        const payload: any = { name: formName, email: formEmail, role_id: formRoleId };
        if (formPassword.trim()) {
          payload.password = formPassword;
        }
        await updateUser.mutateAsync({
          id: editingUser.id,
          data: payload,
        });
        add({ title: "Berhasil", message: "Data user berhasil diperbarui.", variant: "success" });
      } else {
        await createUser.mutateAsync({
          name: formName,
          email: formEmail,
          password: formPassword,
          role_id: formRoleId,
        });
        add({ title: "Berhasil", message: "Data user berhasil ditambahkan.", variant: "success" });
      }
      setModalOpen(false);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Terjadi kesalahan sistem.", variant: "danger" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id);
      add({ title: "Berhasil", message: "Data user berhasil dihapus.", variant: "success" });
      setDeleteConfirmId(null);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Gagal menghapus data.", variant: "danger" });
    }
  };

  const columns = useMemo<ColumnDef<User, any>[]>(() => [
    { id: "no", header: "No", cell: ({ row, table }) => { const { pageIndex, pageSize } = table.getState().pagination; const idx = table.getRowModel().rows.findIndex(r => r.id === row.id); return <span className="text-muted-foreground text-sm">{pageIndex * pageSize + idx + 1}</span>; }, size: 50, enableSorting: false },
    { accessorKey: "name", header: "Nama", cell: (info) => (
      <div className="flex items-center gap-2.5">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${info.getValue()}&backgroundColor=b6e3f4`} className="size-8 rounded-full bg-muted shrink-0 border border-border" alt="" />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{info.getValue() as string}</p>
          <p className="text-xs text-muted-foreground truncate">{info.row.original.email}</p>
        </div>
      </div>
    ), size: 240 },
    { accessorKey: "role_name", header: "Role", cell: (info) => {
      const r = info.row.original.role?.name || info.row.original.role_name || "-";
      return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[r] || "bg-muted text-muted-foreground"}`}>{r}</span>;
    }, size: 140 },
    { accessorKey: "created_at", header: "Dibuat", cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{new Date(info.getValue() as string).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>, size: 140 },
    { id: "actions", header: "Aksi", cell: ({ row }) => {
      if (!permissions.can_update && !permissions.can_delete) return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <div className="flex items-center gap-1">
          {permissions.can_update && <button onClick={() => openEdit(row.original)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Edit className="size-3.5" /></button>}
          {permissions.can_delete && <button onClick={() => setDeleteConfirmId(row.original.id)} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Hapus"><Trash2 className="size-3.5" /></button>}
        </div>
      );
    }, enableSorting: false, size: 90 },
  ], [permissions]);

  const isSaving = createUser.isPending || updateUser.isPending;

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen User" description="Kelola data pengguna dan akses mereka ke sistem." breadcrumbs={[{ label: "Master Data", href: "#" }, { label: "User" }]} />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar User</CardTitle>
          {permissions.can_create && (
            <Button onClick={openCreate} size="sm" disabled={isLoadingRoles || permissions.isLoading}>
              <Plus className="size-4 mr-1.5" />Tambah User
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable data={users} columns={columns} searchPlaceholder="Cari user..." isLoading={isLoadingUsers} canExport={permissions.can_report} exportFilename="users" />
        </CardContent>
      </Card>
      <Modal open={modalOpen} onClose={() => !isSaving && setModalOpen(false)} className="max-w-md">
        <ModalHeader>
          <ModalTitle>{editingUser ? "Edit User" : "Tambah User"}</ModalTitle>
          <ModalClose onClose={() => !isSaving && setModalOpen(false)} />
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Nama <span className="text-red-500">*</span></label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama lengkap" className={inputCls} disabled={isSaving} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
            <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@domain.com" className={inputCls} disabled={isSaving} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Password {!editingUser && <span className="text-red-500">*</span>}</label>
            <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Masukkan password"} className={inputCls} disabled={isSaving} />
            {editingUser && <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah password.</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Role <span className="text-red-500">*</span></label>
            <select value={formRoleId} onChange={(e) => setFormRoleId(Number(e.target.value))} className={inputCls} disabled={isSaving}>
              <option value={0} disabled>Pilih Role</option>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.name} ({role.code})</option>)}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>Batal</Button>
          <Button onClick={handleSave} disabled={!formName.trim() || !formEmail.trim() || (!editingUser && !formPassword.trim()) || formRoleId === 0 || isSaving}>
            {isSaving ? "Menyimpan..." : editingUser ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal open={deleteConfirmId !== null} onClose={() => !deleteUser.isPending && setDeleteConfirmId(null)} className="max-w-sm">
        <ModalHeader><ModalTitle>Konfirmasi Hapus</ModalTitle><ModalClose onClose={() => !deleteUser.isPending && setDeleteConfirmId(null)} /></ModalHeader>
        <ModalBody><p className="text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p></ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={deleteUser.isPending}>Batal</Button>
          <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} disabled={deleteUser.isPending}>
            <Trash2 className="size-3.5 mr-1.5" />
            {deleteUser.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
