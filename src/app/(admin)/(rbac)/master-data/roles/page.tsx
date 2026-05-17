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
import { DUMMY_ROLES } from "@/features/rbac/role/constants/dummy-data";
import type { Role } from "@/features/rbac/role/types";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(DUMMY_ROLES);
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

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) return;
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, code: formCode, name: formName, updated_at: new Date().toISOString() }
            : r
        )
      );
    } else {
      const newRole: Role = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        code: formCode.toUpperCase(),
        name: formName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRoles((prev) => [...prev, newRole]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const columns = useMemo<ColumnDef<Role, any>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const idx = table.getRowModel().rows.findIndex(r => r.id === row.id);
          return <span className="text-muted-foreground text-sm">{pageIndex * pageSize + idx + 1}</span>;
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
          <span className="font-medium text-foreground">{info.getValue() as string}</span>
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
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(row.original)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit"
            >
              <Edit className="size-3.5" />
            </button>
            <button
              onClick={() => setDeleteConfirmId(row.original.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
              title="Hapus"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
        size: 90,
      },
    ],
    []
  );

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
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4 mr-1.5" />
            Tambah Role
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={roles}
            columns={columns}
            searchPlaceholder="Cari role..."
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-md"
      >
        <ModalHeader>
          <ModalTitle>{editingRole ? "Edit Role" : "Tambah Role"}</ModalTitle>
          <ModalClose onClose={() => setModalOpen(false)} />
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
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={!formCode.trim() || !formName.trim()}>
            {editingRole ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        className="max-w-sm"
      >
        <ModalHeader>
          <ModalTitle>Konfirmasi Hapus</ModalTitle>
          <ModalClose onClose={() => setDeleteConfirmId(null)} />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            Apakah kamu yakin ingin menghapus role ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            Hapus
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
