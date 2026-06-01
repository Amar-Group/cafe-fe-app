"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";
import { usePayments } from "@/features/payment/hooks/use-payment";
import { usePaymentColumns } from "./_components/payment-columns";

export default function PaymentsPage() {
  const { data: payments = [], isLoading } = usePayments();
  const permissions = usePermissions();

  const columns = usePaymentColumns();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Pembayaran"
        description="Pantau seluruh transaksi dan riwayat pembayaran pelanggan yang terhubung dengan Midtrans maupun Kasir."
        breadcrumbs={[
          { label: "Transaksi", href: "#" },
          { label: "Pembayaran" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={payments}
            columns={columns}
            searchPlaceholder="Cari ID transaksi..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="cafe-payments-history"
          />
        </CardContent>
      </Card>
    </div>
  );
}
