import { PublicationAdminSchema, PublicationCreateSchema } from "@schemas/Publication";

import { z } from "zod";

export type PublicationCreate = z.infer<typeof PublicationCreateSchema>;
export type PublicationAdmin = z.infer<typeof PublicationAdminSchema>;
