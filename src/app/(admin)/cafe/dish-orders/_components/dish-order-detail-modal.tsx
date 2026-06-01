"use client";

import { useMemo } from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalClose } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import type { DishOrder } from "@/features/cafe/dish-order/types";
import { useDishOrderDetails } from "@/features/cafe/dish-order/hooks/use-dish-order-detail";
import { useDishOrderDetailStore } from "@/features/cafe/dish-order/store";
import { useDishes } from "@/features/cafe/dish/hooks/use-dish";

type DishOrderDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: DishOrder | null;
  permissions: {
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
  };
};

export function DishOrderDetailModal({ isOpen, onClose, order, permissions }: DishOrderDetailModalProps) {
  const { data: allDetails = [] } = useDishOrderDetails();
  const { data: dishes = [] } = useDishes();
  const { openCreate, openEdit, openDelete } = useDishOrderDetailStore();

  const orderDetails = useMemo(() => {
    if (!order) return [];
    return allDetails
      .filter((d) => d.dish_order_id === order.id)
      .map((detail) => {
        const dish = dishes.find((d) => d.id === detail.dish_id);
        return {
          ...detail,
          dish_name: dish?.name || "Unknown Dish",
          dish_price: dish ? Number(dish.price) : 0,
        };
      });
  }, [allDetails, dishes, order]);

  if (!order) return null;

  const isPaid = order.payment_status === "paid";

  return (
    <Modal open={isOpen} onClose={onClose} className="max-w-4xl z-[40]">
      <ModalHeader className="flex-row items-center justify-between pb-2 border-b border-border mb-4">
        <ModalTitle>
          Detail Pesanan: #{order.id} - {order.guest_name}
        </ModalTitle>
        <ModalClose onClose={onClose} />
      </ModalHeader>
      
      <ModalBody className="max-h-[75vh] overflow-y-auto no-scrollbar pb-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div>
            <p className="text-xs text-muted-foreground">Subtotal</p>
            <p className="font-semibold">Rp {Number(order.total).toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pajak (11%)</p>
            <p className="font-semibold text-orange-500">Rp {Number(order.tax).toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Service Fee (5%)</p>
            <p className="font-semibold text-blue-500">Rp {Number(order.service_fee).toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nett Price</p>
            <p className="font-bold text-primary text-lg">Rp {Number(order.nett_price).toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status Pesanan</p>
            <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
              order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
              order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
              order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500' :
              'bg-yellow-500/10 text-yellow-600'
            }`}>
              {order.status || "pending"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-medium text-foreground">Daftar Item (Keranjang)</h3>
          {!isPaid && permissions.can_create && (
            <Button size="sm" onClick={() => openCreate()}>
              <Plus className="size-4 mr-1.5" />
              Tambah Item
            </Button>
          )}
        </div>

        {orderDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">Belum ada item menu di pesanan ini.</p>
            {!isPaid && permissions.can_create && (
              <Button variant="outline" size="sm" onClick={() => openCreate()}>
                Tambah Item Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Menu</th>
                  <th className="px-4 py-3 font-medium">Catatan</th>
                  <th className="px-4 py-3 font-medium text-right">Harga</th>
                  <th className="px-4 py-3 font-medium text-center">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  {!isPaid && <th className="px-4 py-3 font-medium text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orderDetails.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.dish_name}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate" title={item.notes || ""}>
                      {item.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {item.dish_price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {(item.dish_price * item.quantity).toLocaleString("id-ID")}
                    </td>
                    {!isPaid && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {permissions.can_update && (
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Edit Item"
                            >
                              <Edit className="size-3.5" />
                            </button>
                          )}
                          {permissions.can_delete && (
                            <button
                              onClick={() => openDelete(item.id)}
                              className="p-1 rounded text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                              title="Hapus Item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
