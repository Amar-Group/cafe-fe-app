"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";

import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import type { Role } from "@/features/rbac/role/types";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/features/rbac/role/hooks/use-role";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useRoles();
  const { add } = useNotification();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  const permissions = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");

  const openCreate = () => {
    setEditingRole(null);
    setFormCode("");
    setFormName("");
    setModalOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setFormCode(role.code);
    setFormName(role.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formCode.trim() || !formName.trim()) return;
    
    try {
      if (editingRole) {
        await updateRole.mutateAsync({
          id: editingRole.id,
          data: { code: formCode, name: formName },
        });
        add({ title: "Berhasil", message: "Role berhasil diperbarui.", variant: "success" });
      } else {
        await createRole.mutateAsync({
          code: formCode.toUpperCase(),
          name: formName,
        });
        add({ title: "Berhasil", message: "Role berhasil ditambahkan.", variant: "success" });
      }
      setModalOpen(false);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Terjadi kesalahan sistem.", variant: "danger" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole.mutateAsync(id);
      add({ title: "Berhasil", message: "Role berhasil dihapus.", variant: "success" });
      setDeleteConfirmId(null);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Gagal menghapus role.", variant: "danger" });
    }
  };

  const columns = useMemo<ColumnDef<Role, any>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const idx = table.getRowModel().rows.findIndex((r) => r.id === row.id);
          return (
            <span className="text-muted-foreground text-sm">
              {pageIndex * pageSize + idx + 1}
            </span>
          );
        },
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "code",
        header: "Kode",
        cell: (info) => (
          <Badge variant="soft-default" rounded="full" size="sm">
            {info.getValue() as string}
          </Badge>
        ),
        size: 140,
      },
      {
        accessorKey: "name",
        header: "Nama Role",
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "created_at",
        header: "Dibuat",
        cell: (info) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {new Date(info.getValue() as string).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
        size: 140,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          if (!permissions.can_update && !permissions.can_delete) return <span className="text-muted-foreground text-xs">-</span>;
          return (
            <div className="flex items-center gap-1">
              {permissions.can_update && (
                <button
                  onClick={() => openEdit(row.original)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit"
                >
                  <Edit className="size-3.5" />
                </button>
              )}
              {permissions.can_delete && (
                <button
                  onClick={() => setDeleteConfirmId(row.original.id)}
                  className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 90,
      },
    ],
    [permissions]
  );

  const isSaving = createRole.isPending || updateRole.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Role"
        description="Kelola role yang tersedia di sistem."
        breadcrumbs={[
          { label: "Master Data", href: "#" },
          { label: "Role" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Role</CardTitle>
          {permissions.can_create && (
            <Button onClick={openCreate} size="sm" disabled={permissions.isLoading}>
              <Plus className="size-4 mr-1.5" />
              Tambah Role
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={roles}
            columns={columns}
            searchPlaceholder="Cari role..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="roles"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !isSaving && setModalOpen(false)}
        className="max-w-md"
      >
        <ModalHeader>
          <ModalTitle>{editingRole ? "Edit Role" : "Tambah Role"}</ModalTitle>
          <ModalClose onClose={() => !isSaving && setModalOpen(false)} />
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Kode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.toUpperCase())}
              placeholder="Contoh: ADMIN"
              className={inputCls}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Kode unik untuk identifikasi role (uppercase).
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Nama Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Administrator"
              className={inputCls}
              disabled={isSaving}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formCode.trim() || !formName.trim() || isSaving}
          >
            {isSaving ? "Menyimpan..." : editingRole ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmId !== null}
        onClose={() => !deleteRole.isPending && setDeleteConfirmId(null)}
        className="max-w-sm"
      >
        <ModalHeader>
          <ModalTitle>Konfirmasi Hapus</ModalTitle>
          <ModalClose onClose={() => !deleteRole.isPending && setDeleteConfirmId(null)} />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            Apakah kamu yakin ingin menghapus role ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={deleteRole.isPending}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            disabled={deleteRole.isPending}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            {deleteRole.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
