export type BilliardTableImage = {
  id: number;
  billiard_table_id: number;
  image: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateBilliardTableImageRequest = {
  billiard_table_id: number;
  image: string;
  image_public_id: string;
};

export type UpdateBilliardTableImageRequest = Partial<CreateBilliardTableImageRequest>;

export type GroupedBilliardTableImage = {
  table_id: number;
  table_name: string;
  table_thumbnail?: string | null;
  images: BilliardTableImage[];
  total_images: number;
};
