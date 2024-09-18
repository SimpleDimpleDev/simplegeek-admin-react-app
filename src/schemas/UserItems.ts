import { z } from "zod";

import { IdSchema } from "./Primitives";

const BaseUserItemSchema = z.object({
    id: IdSchema,
});

export const UserCartItemSchema = BaseUserItemSchema.extend({
    quantity: z.number(),
});

export const UserFavoriteItemSchema = BaseUserItemSchema.extend({});

export const UserTrackedItemSchema = BaseUserItemSchema.extend({});

export const UserItemsSchema = z.object({
    cart: UserCartItemSchema.array(),
    favorites: UserFavoriteItemSchema.array(),
    tracked: UserTrackedItemSchema.array(),
});