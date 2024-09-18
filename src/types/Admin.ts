import { ImageEditPropsSchema } from "@schemas/Admin";
import { z } from "zod";

export type ImageEditProps = z.infer<typeof ImageEditPropsSchema>;
