import { createCrudStore } from "@/stores/create-crud-store";
import type { BilliardTable } from "./types";

export const useBilliardTableStore = createCrudStore<BilliardTable>();
