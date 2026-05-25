import { createCrudStore } from "@/stores/create-crud-store";
import type { Reservation } from "./types";

export const useReservationStore = createCrudStore<Reservation>();
