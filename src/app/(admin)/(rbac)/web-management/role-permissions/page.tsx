"use client";

import { useState, useMemo, Fragment } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Shield, Check, X, CheckCheck, XCircle, CornerDownRight, Settings, LayoutDashboard, Calendar as CalendarIcon, CalendarCheck, type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";

import type { Role } from "@/features/rbac/role/types";
import type { Menu } from "@/features/rbac/menu/types";
import type { RolePermission } from "@/features/rbac/role-permission/types";

import { useRoles } from "@/features/rbac/role/hooks/use-role";
import { useMenus } from "@/features/rbac/menu/hooks/use-menu";
import {
  useRolePermissions,
  useCreateRolePermission,
  useUpdateRolePermission,
  useDeleteRolePermission,
} from "@/features/rbac/role-permission/hooks/use-role-permission";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

/* ── Permission keys ── */
const PERM_KEYS = ["can_read", "can_create", "can_update", "can_delete", "can_report"] as const;
const PERM_LABELS: Record<string, string> = {
  can_read: "Baca",
  can_create: "Tambah",
  can_update: "Ubah",
  can_delete: "Hapus",
  can_report: "Laporan",
};

/* ── Icon map for standalone menus ── */
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar: CalendarIcon,
  CalendarCheck,
  Settings,
};

/* ── Permission Checkbox ── */
function PermCheck({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`inline-flex items-center justify-center size-7 rounded-full transition-all ${checked
          ? "bg-green-500 text-white shadow-sm shadow-green-200"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {checked ? <Check className="size-4" /> : <X className="size-3.5" />}
    </button>
  );
}

/* ── Per-menu permission state ── */
type MenuPermState = Record<number, {
  id?: number; // Keep track of existing permission ID
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}>;

function buildPermState(roleId: number, perms: RolePermission[], menus: Menu[]): MenuPermState {
  const state: MenuPermState = {};
  for (const menu of menus) {
    if (!menu.path) continue;
    state[menu.id] = { can_read: false, can_create: false, can_update: false, can_delete: false, can_report: false };
  }
  for (const p of perms) {
    if (p.role_id === roleId && state[p.menu_id]) {
      state[p.menu_id] = {
        id: p.id,
        can_read: p.can_read,
        can_create: p.can_create,
        can_update: p.can_update,
        can_delete: p.can_delete,
        can_report: p.can_report,
      };
    }
  }
  return state;
}

interface MenuGroup {
  parent: Menu | null;
  children: Menu[];
}

function groupMenus(menus: Menu[]): MenuGroup[] {
  const groups: MenuGroup[] = [];
  const standalones = menus.filter((m) => m.path && m.parent_id === null);
  if (standalones.length > 0) {
    groups.push({ parent: null, children: standalones });
  }
  const parents = menus.filter((m) => !m.path && m.parent_id === null);
  for (const parent of parents) {
    const children = menus.filter((m) => m.parent_id === parent.id && m.path);
    if (children.length > 0) {
      groups.push({ parent, children });
    }
  }
  return groups;
}

export default function RolePermissionsPage() {
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const { data: menus = [], isLoading: loadingMenus } = useMenus();
  const { data: perms = [], isLoading: loadingPerms } = useRolePermissions();
  const permissions = usePermissions();
  const { add } = useNotification();

  const createPerm = useCreateRolePermission();
  const updatePerm = useUpdateRolePermission();
  const deletePerm = useDeleteRolePermission();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permState, setPermState] = useState<MenuPermState>({});
  const [isSaving, setIsSaving] = useState(false);

  const menuGroups = useMemo(() => groupMenus(menus), [menus]);

  const openPermissions = (role: Role) => {
    setSelectedRole(role);
    setPermState(buildPermState(role.id, perms, menus));
    setModalOpen(true);
  };

  const togglePerm = (menuId: number, key: string) => {
    if (isSaving) return;
    setPermState((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], [key]: !prev[menuId]?.[key] },
    }));
  };

  const setAll = (val: boolean) => {
    if (isSaving) return;
    setPermState((prev) => {
      const next = { ...prev };
      for (const menuId of Object.keys(next)) {
        const mid = Number(menuId);
        next[mid] = { ...next[mid], can_read: val, can_create: val, can_update: val, can_delete: val, can_report: val };
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRole || isSaving) return;
    setIsSaving(true);

    try {
      const roleId = selectedRole.id;
      const promises: Promise<any>[] = [];

      for (const [menuIdStr, state] of Object.entries(permState)) {
        const menuId = Number(menuIdStr);
        const hasAny = state.can_read || state.can_create || state.can_update || state.can_delete || state.can_report;

        if (state.id) {
          // Existing permission
          if (hasAny) {
            // Update
            promises.push(updatePerm.mutateAsync({
              id: state.id,
              data: {
                role_id: roleId,
                menu_id: menuId,
                can_read: state.can_read,
                can_create: state.can_create,
                can_update: state.can_update,
                can_delete: state.can_delete,
                can_report: state.can_report,
              }
            }));
          } else {
            // All false -> Delete
            promises.push(deletePerm.mutateAsync(state.id));
          }
        } else if (hasAny) {
          // New permission -> Create
          promises.push(createPerm.mutateAsync({
            role_id: roleId,
            menu_id: menuId,
            can_read: state.can_read,
            can_create: state.can_create,
            can_update: state.can_update,
            can_delete: state.can_delete,
            can_report: state.can_report,
          }));
        }
      }

      await Promise.all(promises);
      add({ title: "Berhasil", message: "Hak akses role berhasil diperbarui.", variant: "success" });
      setModalOpen(false);
    } catch (error: any) {
      add({ title: "Gagal", message: error.message || "Terjadi kesalahan sistem saat memperbarui role permission.", variant: "danger" });
      console.error("Failed to save permissions", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPermCount = (roleId: number) => {
    return perms.filter((p) => p.role_id === roleId).length;
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
        size: 120,
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
        id: "perm_count",
        header: "Menu Terdaftar",
        cell: ({ row }) => {
          const count = getPermCount(row.original.id);
          return (
            <Badge variant={count > 0 ? "soft-success" : "soft-secondary"} rounded="full" size="sm">
              {count} menu
            </Badge>
          );
        },
        size: 140,
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
          if (!permissions.can_update) return <span className="text-muted-foreground text-xs">-</span>;
          return (
            <button
              onClick={() => openPermissions(row.original)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              title="Atur Permission"
            >
              <Shield className="size-3.5" />
              Permission
            </button>
          );
        },
        enableSorting: false,
        size: 140,
      },
    ],
    [perms, permissions]
  );

  const isDataLoading = loadingRoles || loadingMenus || loadingPerms;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Role Permission"
        description="Atur hak akses setiap role terhadap menu yang tersedia."
        breadcrumbs={[{ label: "Web Management", href: "#" }, { label: "Role Permission" }]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Role</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={roles}
            columns={columns}
            searchPlaceholder="Cari role..."
            exportFilename="role-permissions"
            isLoading={isDataLoading}
            canExport={permissions.can_report}
          />
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => !isSaving && setModalOpen(false)}
        className="max-w-4xl max-h-[85vh] flex flex-col"
      >
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 text-blue-600">
              <Shield className="size-5" />
            </div>
            <div>
              <ModalTitle>Roles & Permissions</ModalTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Mengatur hak akses untuk role:{" "}
                <strong className="text-foreground">
                  {selectedRole?.code} — {selectedRole?.name}
                </strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAll(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors border border-green-200"
            >
              <CheckCheck className="size-3.5" />
              CENTANG SEMUA
            </button>
            <button
              onClick={() => setAll(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors border border-border"
            >
              <XCircle className="size-3.5" />
              HAPUS SEMUA
            </button>
            <ModalClose onClose={() => !isSaving && setModalOpen(false)} />
          </div>
        </ModalHeader>

        <ModalBody className="p-0 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-card border-b border-border sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[40%]">
                  Menu
                </th>
                {PERM_KEYS.map((key) => (
                  <th
                    key={key}
                    className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {PERM_LABELS[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuGroups.map((group, gi) => (
                <Fragment key={`group-${gi}`}>
                  {group.parent && (
                    <tr key={`g-${gi}`} className="bg-muted/50">
                      <td colSpan={6} className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          <Settings className="size-4 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">
                            {group.parent.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {group.children.map((menu) => (
                    <tr
                      key={menu.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className={`flex items-start gap-2 ${menu.parent_id ? "pl-2" : ""}`}>
                          {menu.parent_id ? (
                            <CornerDownRight className="size-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                          ) : menu.icon && ICON_MAP[menu.icon] ? (
                            (() => { const Icon = ICON_MAP[menu.icon]; return <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />; })()
                          ) : null}
                          <div>
                            <span className="text-sm font-medium text-foreground">{menu.name}</span>
                            <p className="text-xs text-rose-500 font-mono mt-0.5">
                              {menu.permission_path || menu.path}
                            </p>
                          </div>
                        </div>
                      </td>
                      {PERM_KEYS.map((key) => (
                        <td key={key} className="px-3 py-3 text-center">
                          <PermCheck
                            disabled={isSaving}
                            checked={permState[menu.id]?.[key] ?? false}
                            onChange={() => togglePerm(menu.id, key)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="size-4 mr-1.5" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
