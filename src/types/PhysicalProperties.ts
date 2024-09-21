import { PhysicalPropertiesSchema } from "@schemas/PhysicalProperties";
import { z } from "zod";

export type PhysicalProperties = z.infer<typeof PhysicalPropertiesSchema>;
