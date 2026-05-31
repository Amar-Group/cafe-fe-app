export type BilliardTableType = {
  id: number;
  name: string;
  icon: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBilliardTableTypeRequest = {
  name: string;
  icon?: string | null;
  description?: string | null;
};

export type UpdateBilliardTableTypeRequest = Partial<CreateBilliardTableTypeRequest>;
