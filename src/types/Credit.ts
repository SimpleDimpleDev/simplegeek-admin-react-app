import { CreditInfoSchema } from "@schemas/Payment";
import { z } from "zod";

export type CreditInfo = z.infer<typeof CreditInfoSchema>;
