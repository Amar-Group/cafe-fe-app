export type DishImage = {
  id: number;
  dish_id: number;
  image: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateDishImageRequest = {
  dish_id: number;
  image: string;
  image_public_id: string;
};

export type UpdateDishImageRequest = Partial<CreateDishImageRequest>;

export type GroupedDishImage = {
  dish_id: number;
  dish_name: string;
  dish_thumbnail?: string | null;
  images: DishImage[];
  total_images: number;
};
