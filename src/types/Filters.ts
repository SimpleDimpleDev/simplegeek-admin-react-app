import { FilterGroupGetSchema, FilterGroupNewSchema } from "@schemas/FilterGroup";

import { z } from "zod";

export type FilterGroupCreate = z.infer<typeof FilterGroupNewSchema>;
export type FilterGroupGet = z.infer<typeof FilterGroupGetSchema>;
