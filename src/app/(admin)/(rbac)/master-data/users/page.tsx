"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { DUMMY_USERS } from "@/features/rbac/user/constants/dummy-data";
import { DUMMY_ROLES } from "@/features/rbac/role/constants/dummy-data";
import type { User } from "@/features/rbac/user/types";

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
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState<number>(DUMMY_ROLES[0]?.id || 1);

  const openCreate = () => {
    setEditingUser(null);
    setFormName(""); setFormEmail(""); setFormPassword("");
    setFormRoleId(DUMMY_ROLES[0]?.id || 1);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name); setFormEmail(user.email); setFormPassword("");
    setFormRoleId(user.role_id);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    if (!editingUser && !formPassword.trim()) return;
    const selectedRole = DUMMY_ROLES.find((r) => r.id === formRoleId);
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id
        ? { ...u, name: formName, email: formEmail, role_id: formRoleId, role_name: selectedRole?.name, updated_at: new Date().toISOString() }
        : u
      ));
    } else {
      setUsers((prev) => [...prev, {
        id: Math.max(...prev.map((u) => u.id), 0) + 1,
        name: formName, email: formEmail, role_id: formRoleId, role_name: selectedRole?.name,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => { setUsers((p) => p.filter((u) => u.id !== id)); setDeleteConfirmId(null); };

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
      const r = (info.getValue() as string) || "-";
      return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[r] || "bg-muted text-muted-foreground"}`}>{r}</span>;
    }, size: 140 },
    { accessorKey: "created_at", header: "Dibuat", cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{new Date(info.getValue() as string).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>, size: 140 },
    { id: "actions", header: "Aksi", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row.original)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Edit className="size-3.5" /></button>
        <button onClick={() => setDeleteConfirmId(row.original.id)} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Hapus"><Trash2 className="size-3.5" /></button>
      </div>
    ), enableSorting: false, size: 90 },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen User" description="Kelola data pengguna dan akses mereka ke sistem." breadcrumbs={[{ label: "Master Data", href: "#" }, { label: "User" }]} />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar User</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="size-4 mr-1.5" />Tambah User</Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable data={users} columns={columns} searchPlaceholder="Cari user..." />
        </CardContent>
      </Card>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="max-w-md">
        <ModalHeader>
          <ModalTitle>{editingUser ? "Edit User" : "Tambah User"}</ModalTitle>
          <ModalClose onClose={() => setModalOpen(false)} />
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Nama <span className="text-red-500">*</span></label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama lengkap" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
            <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@domain.com" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Password {!editingUser && <span className="text-red-500">*</span>}</label>
            <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Masukkan password"} className={inputCls} />
            {editingUser && <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah password.</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Role <span className="text-red-500">*</span></label>
            <select value={formRoleId} onChange={(e) => setFormRoleId(Number(e.target.value))} className={inputCls}>
              {DUMMY_ROLES.map((role) => <option key={role.id} value={role.id}>{role.name} ({role.code})</option>)}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={!formName.trim() || !formEmail.trim() || (!editingUser && !formPassword.trim())}>{editingUser ? "Simpan Perubahan" : "Tambah"}</Button>
        </ModalFooter>
      </Modal>
      <Modal open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)} className="max-w-sm">
        <ModalHeader><ModalTitle>Konfirmasi Hapus</ModalTitle><ModalClose onClose={() => setDeleteConfirmId(null)} /></ModalHeader>
        <ModalBody><p className="text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p></ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Batal</Button>
          <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}><Trash2 className="size-3.5 mr-1.5" />Hapus</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
