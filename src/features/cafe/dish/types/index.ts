export type Dish = {
  id: number;
  dish_category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  thumbnail: string | null;
  thumbnail_public_id: string | null;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateDishRequest = {
  dish_category_id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  thumbnail?: string | null;
  thumbnail_public_id?: string | null;
  is_available?: boolean;
  is_active?: boolean;
};

export type UpdateDishRequest = Partial<CreateDishRequest>;
