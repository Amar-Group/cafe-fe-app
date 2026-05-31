"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

import { useDishOrders, useDeleteDishOrder } from "@/features/cafe/dish-order/hooks/use-dish-order";
import { useDeleteDishOrderDetail } from "@/features/cafe/dish-order/hooks/use-dish-order-detail";
import { useDishOrderStore, useDishOrderDetailStore } from "@/features/cafe/dish-order/store";

import { useDishOrderColumns } from "./_components/dish-order-columns";
import { DishOrderFormModal } from "./_components/dish-order-form-modal";
import { DishOrderDetailModal } from "./_components/dish-order-detail-modal";
import { DishOrderDetailFormModal } from "./_components/dish-order-detail-form-modal";
import { DishOrderPaymentModal } from "./_components/dish-order-payment-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";
import type { DishOrder } from "@/features/cafe/dish-order/types";

export default function DishOrdersPage() {
  const { data: dishOrders = [], isLoading } = useDishOrders();
  const permissions = usePermissions();
  const { add } = useNotification();
  
  const deleteOrder = useDeleteDishOrder();
  const deleteDetail = useDeleteDishOrderDetail();

  // Stores
  const { openCreate, deleteId: orderDeleteId, closeDelete: closeOrderDelete } = useDishOrderStore();
  const { deleteId: detailDeleteId, closeDelete: closeDetailDelete } = useDishOrderDetailStore();

  // Local state for detail modal
  const [selectedOrder, setSelectedOrder] = useState<DishOrder | null>(null);

  // Keep selected order updated automatically if it's open and data changes (e.g. calculation finished)
  const activeOrder = selectedOrder ? dishOrders.find(o => o.id === selectedOrder.id) || null : null;

  const columns = useDishOrderColumns({
    onOpenDetails: (order) => setSelectedOrder(order),
    permissions,
  });

  const handleDeleteOrder = async () => {
    if (!orderDeleteId) return;
    try {
      await deleteOrder.mutateAsync(orderDeleteId);
      add({
        title: "Berhasil",
        message: "Pesanan berhasil dihapus.",
        variant: "success",
      });
      closeOrderDelete();
      // If we just deleted the currently viewed order, close details too
      if (selectedOrder?.id === orderDeleteId) {
        setSelectedOrder(null);
      }
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus pesanan.",
        variant: "danger",
      });
    }
  };

  const handleDeleteDetail = async () => {
    if (!detailDeleteId) return;
    try {
      await deleteDetail.mutateAsync(detailDeleteId);
      add({
        title: "Berhasil",
        message: "Item berhasil dihapus dari pesanan.",
        variant: "success",
      });
      closeDetailDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus item pesanan.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Pesanan (Cafe)"
        description="Kelola pesanan pelanggan, perhitungan subtotal, dan keranjang menu."
        breadcrumbs={[
          { label: "Cafe", href: "#" },
          { label: "Pesanan" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Riwayat Pesanan</CardTitle>
          {permissions.can_create && (
            <Button onClick={() => openCreate()} size="sm">
              <Plus className="size-4 mr-1.5" />
              Buat Pesanan Baru
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={dishOrders}
            columns={columns}
            searchPlaceholder="Cari pesanan (nama tamu atau telepon)..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="cafe-dish-orders"
          />
        </CardContent>
      </Card>

      <DishOrderFormModal />

      <DishOrderDetailModal
        isOpen={!!activeOrder}
        onClose={() => setSelectedOrder(null)}
        order={activeOrder}
        permissions={permissions}
      />

      <DishOrderDetailFormModal
        dishOrderId={activeOrder?.id || null}
      />

      <DishOrderPaymentModal />

      {/* Modal konfirmasi hapus untuk header (Dish Order) */}
      <DeleteConfirmModal
        open={orderDeleteId !== null}
        onOpenChange={(open) => !open && closeOrderDelete()}
        onConfirm={handleDeleteOrder}
        isPending={deleteOrder.isPending}
        description="Apakah kamu yakin ingin menghapus struk pesanan ini beserta seluruh itemnya? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Modal konfirmasi hapus untuk item detail (Dish Order Detail) */}
      <DeleteConfirmModal
        open={detailDeleteId !== null}
        onOpenChange={(open) => !open && closeDetailDelete()}
        onConfirm={handleDeleteDetail}
        isPending={deleteDetail.isPending}
        description="Apakah kamu yakin ingin mengeluarkan item menu ini dari pesanan? Total tagihan akan otomatis dikalkulasi ulang."
      />
    </div>
  );
}
