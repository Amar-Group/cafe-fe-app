export type DishCategory = {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDishCategoryRequest = {
  name: string;
  icon?: string | null;
};

export type UpdateDishCategoryRequest = Partial<CreateDishCategoryRequest>;
