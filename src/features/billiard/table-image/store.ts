import { createCrudStore } from "@/stores/create-crud-store";
import type { BilliardTableImage } from "./types";

export const useBilliardTableImageStore = createCrudStore<BilliardTableImage>();
