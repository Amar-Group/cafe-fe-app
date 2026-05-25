import { createCrudStore } from "@/stores/create-crud-store";
import type { BilliardTableType } from "./types";

export const useBilliardTableTypeStore = createCrudStore<BilliardTableType>();
