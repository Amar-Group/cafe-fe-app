import { createCrudStore } from "@/stores/create-crud-store";
import type { DishImage } from "./types";

// Standard CRUD store for Dish Images
export const useDishImageStore = createCrudStore<DishImage>();
