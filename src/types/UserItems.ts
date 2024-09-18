import {
	UserCartItemSchema,
	UserFavoriteItemSchema,
	UserItemsSchema,
	UserTrackedItemSchema,
} from "@schemas/UserItems";

import { z } from "zod";

export type UserCartItem = z.infer<typeof UserCartItemSchema>;
export type UserFavoriteItem = z.infer<typeof UserFavoriteItemSchema>;
export type UserTrackedItem = z.infer<typeof UserTrackedItemSchema>;
export type UserItems = z.infer<typeof UserItemsSchema>;
