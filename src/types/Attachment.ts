import { AttachmentGetSchema } from "@schemas/Attachment";
import { z } from "zod";

export type AttachmentGet = z.infer<typeof AttachmentGetSchema>;
