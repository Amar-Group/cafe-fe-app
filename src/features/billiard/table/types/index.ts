export type BilliardTable = {
  id: number;
  table_type_id: number;
  name: string;
  slug: string;
  price: string;
  thumbnail: string | null;
  thumbnail_public_id: string | null;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  type?: {
    id: number;
    name: string;
    icon: string | null;
  };
};

export type CreateBilliardTableRequest = {
  table_type_id: number;
  name: string;
  slug: string;
  price: string;
  thumbnail?: string | null;
  thumbnail_public_id?: string | null;
  is_available?: boolean;
  is_active?: boolean;
};

export type UpdateBilliardTableRequest = Partial<CreateBilliardTableRequest>;
