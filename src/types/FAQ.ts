import { FAQItemGetSchema } from "@schemas/FAQ";
import { z } from "zod";

export type FAQItemGet = z.infer<typeof FAQItemGetSchema>;
