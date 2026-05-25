export type Reservation = {
  id: number;
  billiard_table_id: number;
  guest_name: string;
  guest_phone: string;
  date: string;
  schedule_id: number;
  guest_count: number;
  notes: string | null;
  status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  schedule: {
    id: number;
    start_time: string;
    end_time: string;
  };
};

export type CreateReservationRequest = {
  billiard_table_id: number;
  guest_name: string;
  guest_phone: string;
  date: string;
  schedule_id: number;
  guest_count: number;
  notes?: string | null;
  status?: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
};

export type UpdateReservationRequest = Partial<CreateReservationRequest>;
