import { FilterGroupAdminSchema, FilterGroupGetSchema, FilterGroupNewSchema } from "@schemas/FilterGroup";

import { z } from "zod";

export type FilterGroupGet = z.infer<typeof FilterGroupGetSchema>;
export type FilterGroupCreate = z.infer<typeof FilterGroupNewSchema>;
export type FilterGroupAdmin = z.infer<typeof FilterGroupAdminSchema>;
