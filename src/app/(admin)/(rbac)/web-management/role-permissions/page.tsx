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
import { DUMMY_ROLES } from "@/features/rbac/role/constants/dummy-data";
import { DUMMY_MENUS } from "@/features/rbac/menu/constants/dummy-data";
import { DUMMY_ROLE_PERMISSIONS } from "@/features/rbac/role-permission/constants/dummy-data";
import type { Role } from "@/features/rbac/role/types";
import type { Menu } from "@/features/rbac/menu/types";
import type { RolePermission } from "@/features/rbac/role-permission/types";

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
function PermCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`inline-flex items-center justify-center size-7 rounded-full transition-all ${
        checked
          ? "bg-green-500 text-white shadow-sm shadow-green-200"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {checked ? <Check className="size-4" /> : <X className="size-3.5" />}
    </button>
  );
}

/* ── Per-menu permission state ── */
type MenuPermState = Record<number, Record<string, boolean>>;

/**
 * Build initial permission state for a role.
 * Only includes menus that have a non-null `path` (real pages, not dropdown containers).
 */
function buildPermState(roleId: number, perms: RolePermission[], menus: Menu[]): MenuPermState {
  const state: MenuPermState = {};
  // Initialize all menus that have a path (they're real pages)
  for (const menu of menus) {
    if (!menu.path) continue; // path is null → parent/dropdown → skip
    state[menu.id] = { can_read: false, can_create: false, can_update: false, can_delete: false, can_report: false };
  }
  // Fill existing permissions
  for (const p of perms) {
    if (p.role_id === roleId && state[p.menu_id]) {
      state[p.menu_id] = {
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

/* ── Group menus for the modal ── */
interface MenuGroup {
  parent: Menu | null;
  children: Menu[];
}

/**
 * Groups menus by parent for the permission modal.
 *
 * Logic based on `path`:
 * - path === null  →  parent/dropdown container  →  shown as group header (no checkboxes)
 * - path !== null  →  real page  →  shown with checkboxes
 *
 * Standalone menus (path !== null, parent_id === null) are grouped under "Umum".
 */
function groupMenus(menus: Menu[]): MenuGroup[] {
  const groups: MenuGroup[] = [];

  // 1. Standalone menus (has path, no parent) → "Umum" group
  const standalones = menus.filter((m) => m.path && m.parent_id === null);
  if (standalones.length > 0) {
    groups.push({ parent: null, children: standalones });
  }

  // 2. Parent menus (path is null) → group headers with their children
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
  const [perms, setPerms] = useState<RolePermission[]>(DUMMY_ROLE_PERMISSIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permState, setPermState] = useState<MenuPermState>({});

  const menuGroups = useMemo(() => groupMenus(DUMMY_MENUS), []);

  /* ── Open modal for a role ── */
  const openPermissions = (role: Role) => {
    setSelectedRole(role);
    setPermState(buildPermState(role.id, perms, DUMMY_MENUS));
    setModalOpen(true);
  };

  /* ── Toggle single perm ── */
  const togglePerm = (menuId: number, key: string) => {
    setPermState((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], [key]: !prev[menuId]?.[key] },
    }));
  };

  /* ── Check / Uncheck All ── */
  const setAll = (val: boolean) => {
    setPermState((prev) => {
      const next = { ...prev };
      for (const menuId of Object.keys(next)) {
        const mid = Number(menuId);
        next[mid] = { can_read: val, can_create: val, can_update: val, can_delete: val, can_report: val };
      }
      return next;
    });
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!selectedRole) return;
    const roleId = selectedRole.id;

    // Remove old perms for this role, add new ones
    const otherPerms = perms.filter((p) => p.role_id !== roleId);
    const newPerms: RolePermission[] = [];
    let nextId = Math.max(...perms.map((p) => p.id), 0) + 1;

    for (const [menuIdStr, permObj] of Object.entries(permState)) {
      const menuId = Number(menuIdStr);
      const menu = DUMMY_MENUS.find((m) => m.id === menuId);
      const hasAny = Object.values(permObj).some(Boolean);
      if (hasAny) {
        newPerms.push({
          id: nextId++,
          role_id: roleId,
          role_name: selectedRole.name,
          menu_id: menuId,
          menu_name: menu?.name,
          can_read: permObj.can_read,
          can_create: permObj.can_create,
          can_update: permObj.can_update,
          can_delete: permObj.can_delete,
          can_report: permObj.can_report,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    setPerms([...otherPerms, ...newPerms]);
    setModalOpen(false);
  };

  /* ── Count permissions per role ── */
  const getPermCount = (roleId: number) => {
    return perms.filter((p) => p.role_id === roleId).length;
  };

  /* ── Table columns: show roles ── */
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
        cell: ({ row }) => (
          <button
            onClick={() => openPermissions(row.original)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
            title="Atur Permission"
          >
            <Shield className="size-3.5" />
            Permission
          </button>
        ),
        enableSorting: false,
        size: 140,
      },
    ],
    [perms]
  );

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
            data={DUMMY_ROLES}
            columns={columns}
            searchPlaceholder="Cari role..."
            exportFilename="role-permissions"
          />
        </CardContent>
      </Card>

      {/* ── Permission Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
            >
              <CheckCheck className="size-3.5" />
              CENTANG SEMUA
            </button>
            <button
              onClick={() => setAll(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors border border-border"
            >
              <XCircle className="size-3.5" />
              HAPUS SEMUA
            </button>
            <ModalClose onClose={() => setModalOpen(false)} />
          </div>
        </ModalHeader>

        <ModalBody className="p-0 overflow-y-auto">
          {/* Permission Table */}
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
                  {/* Parent / Group header row — only for actual parent groups */}
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

                  {/* Child menus with checkboxes (only if path is not null) */}
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
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            <Check className="size-4 mr-1.5" />
            Simpan Perubahan
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
