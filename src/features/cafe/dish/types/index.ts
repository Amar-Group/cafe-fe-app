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
  category?: {
    id: number;
    name: string;
    icon: string | null;
  };
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

export interface MenuPreviewItem {
  dish_id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  bestSeller?: boolean;
  isNew?: boolean;
  spicyLevel?: number;
  vegetarian?: boolean;
}
