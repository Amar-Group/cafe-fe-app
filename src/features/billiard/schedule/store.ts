import { createCrudStore } from "@/stores/create-crud-store";
import type { Schedule } from "./types";

export const useScheduleStore = createCrudStore<Schedule>();
