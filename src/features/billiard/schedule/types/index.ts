export type Schedule = {
  id: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

export type CreateScheduleRequest = {
  start_time: string;
  end_time: string;
};

export type UpdateScheduleRequest = Partial<CreateScheduleRequest>;
