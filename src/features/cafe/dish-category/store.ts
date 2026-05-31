import { createCrudStore } from "@/stores/create-crud-store";
import type { DishCategory } from "./types";

export const useDishCategoryStore = createCrudStore<DishCategory>();
