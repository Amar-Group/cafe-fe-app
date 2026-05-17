"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import type { Menu } from "@/features/rbac/menu/types";
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
} from "@/features/rbac/menu/hooks/use-menu";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

const inputCls = "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export default function MenusPage() {
  const { data: menus = [], isLoading } = useMenus();
  const { add } = useNotification();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();
  const permissions = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const [formName, setFormName] = useState("");
  const [formPath, setFormPath] = useState("");
  const [formPermissionPath, setFormPermissionPath] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formParentId, setFormParentId] = useState<number | "">("");

  const parentMenus = useMemo(() => menus.filter((m) => m.parent_id === null), [menus]);

  const openCreate = () => {
    setEditingMenu(null);
    setFormName(""); setFormPath(""); setFormPermissionPath(""); setFormIcon(""); setFormParentId("");
    setModalOpen(true);
  };

  const openEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormName(menu.name); setFormPath(menu.path || ""); setFormPermissionPath(menu.permission_path || "");
    setFormIcon(menu.icon || ""); setFormParentId(menu.parent_id ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    const parentId = formParentId === "" ? null : Number(formParentId);

    const payload = {
      name: formName,
      path: formPath || null,
      permission_path: formPermissionPath || null,
      icon: formIcon || null,
      parent_id: parentId,
    };

    try {
      if (editingMenu) {
        await updateMenu.mutateAsync({
          id: editingMenu.id,
          data: payload,
        });
        add({ title: "Berhasil", message: "Menu berhasil diperbarui.", variant: "success" });
      } else {
        await createMenu.mutateAsync(payload);
        add({ title: "Berhasil", message: "Menu berhasil ditambahkan.", variant: "success" });
      }
      setModalOpen(false);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Terjadi kesalahan sistem.", variant: "danger" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenu.mutateAsync(id);
      add({ title: "Berhasil", message: "Menu berhasil dihapus.", variant: "success" });
      setDeleteConfirmId(null);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Gagal menghapus menu.", variant: "danger" });
    }
  };

  const columns = useMemo<ColumnDef<Menu, any>[]>(() => [
    { id: "no", header: "No", cell: ({ row, table }) => { const { pageIndex, pageSize } = table.getState().pagination; const idx = table.getRowModel().rows.findIndex(r => r.id === row.id); return <span className="text-muted-foreground text-sm">{pageIndex * pageSize + idx + 1}</span>; }, size: 50, enableSorting: false },
    { accessorKey: "name", header: "Nama Menu", cell: (info) => <span className="font-medium text-foreground">{info.getValue() as string}</span>, size: 180 },
    { accessorKey: "path", header: "Path", cell: (info) => {
      const v = info.getValue() as string | null;
      return v ? <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{v}</code> : <span className="text-muted-foreground">—</span>;
    }, size: 200 },
    { accessorKey: "permission_path", header: "Permission Path", cell: (info) => {
      const v = info.getValue() as string | null;
      return v ? <Badge variant="soft-info" rounded="full" size="sm">{v}</Badge> : <span className="text-muted-foreground">—</span>;
    }, size: 180 },
    { accessorKey: "parent_name", header: "Parent", cell: (info) => {
      const v = info.row.original.parent_name;
      return v ? <Badge variant="outline-secondary" rounded="full" size="sm">{v}</Badge> : <span className="text-muted-foreground">—</span>;
    }, size: 140 },
    { accessorKey: "icon", header: "Icon", cell: (info) => {
      const v = info.getValue() as string | null;
      return v ? <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{v}</code> : <span className="text-muted-foreground">—</span>;
    }, size: 130 },
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

  const isSaving = createMenu.isPending || updateMenu.isPending;

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Menu" description="Kelola menu navigasi dan permission path yang tersedia." breadcrumbs={[{ label: "Web Management", href: "#" }, { label: "Menu" }]} />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Menu</CardTitle>
          {permissions.can_create && <Button onClick={openCreate} size="sm" disabled={permissions.isLoading}><Plus className="size-4 mr-1.5" />Tambah Menu</Button>}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable data={menus} columns={columns} searchPlaceholder="Cari menu..." isLoading={isLoading} canExport={permissions.can_report} exportFilename="menus" />
        </CardContent>
      </Card>
      <Modal open={modalOpen} onClose={() => !isSaving && setModalOpen(false)} className="max-w-md">
        <ModalHeader><ModalTitle>{editingMenu ? "Edit Menu" : "Tambah Menu"}</ModalTitle><ModalClose onClose={() => !isSaving && setModalOpen(false)} /></ModalHeader>
        <ModalBody className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Nama Menu <span className="text-red-500">*</span></label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Contoh: Dashboard" className={inputCls} disabled={isSaving} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Path</label>
            <input type="text" value={formPath} onChange={(e) => setFormPath(e.target.value)} placeholder="/dashboard" className={inputCls} disabled={isSaving} />
            <p className="text-xs text-muted-foreground">URL navigasi di frontend.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Permission Path</label>
            <input type="text" value={formPermissionPath} onChange={(e) => setFormPermissionPath(e.target.value)} placeholder="/api/menus" className={inputCls} disabled={isSaving} />
            <p className="text-xs text-muted-foreground">Path API untuk pengecekan RBAC.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Icon</label>
            <input type="text" value={formIcon} onChange={(e) => setFormIcon(e.target.value)} placeholder="LayoutDashboard" className={inputCls} disabled={isSaving} />
            <p className="text-xs text-muted-foreground">Nama icon dari Lucide React.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Parent Menu</label>
            <select value={formParentId} onChange={(e) => setFormParentId(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} disabled={isSaving}>
              <option value="">— Tanpa Parent (Root) —</option>
              {parentMenus.filter((pm) => pm.id !== editingMenu?.id).map((pm) => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>Batal</Button>
          <Button onClick={handleSave} disabled={!formName.trim() || isSaving}>{isSaving ? "Menyimpan..." : editingMenu ? "Simpan Perubahan" : "Tambah"}</Button>
        </ModalFooter>
      </Modal>
      <Modal open={deleteConfirmId !== null} onClose={() => !deleteMenu.isPending && setDeleteConfirmId(null)} className="max-w-sm">
        <ModalHeader><ModalTitle>Konfirmasi Hapus</ModalTitle><ModalClose onClose={() => !deleteMenu.isPending && setDeleteConfirmId(null)} /></ModalHeader>
        <ModalBody><p className="text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.</p></ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={deleteMenu.isPending}>Batal</Button>
          <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} disabled={deleteMenu.isPending}><Trash2 className="size-3.5 mr-1.5" />{deleteMenu.isPending ? "Menghapus..." : "Hapus"}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
