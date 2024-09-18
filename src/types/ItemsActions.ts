import { UserItems } from "./UserItems";

type CartActions = {
    add: (id: string) => void,
    increment: (id: string) => void,
    decrement: (id: string) => void,
    removeMany: (ids: string[]) => void,
    revalidate: (cart: UserItems["cart"]) => void,
};

type FavoriteActions = {
    add: (id: string) => void,
    remove: (id: string) => void,
};

type NotificatedActions = {
    add: (id: string) => void,
    remove: (id: string) => void,
};

export type ItemsActions = {
    cart: CartActions,
    favorites: FavoriteActions,
    tracked: NotificatedActions,
};
