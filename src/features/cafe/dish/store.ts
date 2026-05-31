import { createCrudStore } from "@/stores/create-crud-store";
import type { Dish } from "./types";

export const useDishStore = createCrudStore<Dish>();
