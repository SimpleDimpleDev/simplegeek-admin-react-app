import { PublicationCreateSchema, PublicationGetSchema } from "@schemas/Publication";

import { z } from "zod";

export type PublicationCreate = z.infer<typeof PublicationCreateSchema>;
export type PublicationGet = z.infer<typeof PublicationGetSchema>;
